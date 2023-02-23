import {EventEmitter} from 'events'
import {IDbData, IFieldNames} from '../models/db.model'
import {TableCreateModes} from '../../common/enums'
import {formatDateY, formatDateYM, formatDateYMD, formatDateYMW} from '../utils/util'
import {Config} from '../../config/config.default'
import {existsSync} from 'fs'
import {MessageQueue} from '../../common/mq'
import {ClientService} from './client.service'
import {SessionService} from './session.service'
import {MessageSecurityMode, SecurityPolicy} from 'node-opcua'
import Path from 'path'
import {CertificateService} from './certificate.service'
import {MessageModel} from '../models/message.model'
import Database = require('better-sqlite3')

// import {AttributeIds, DataValue, MessageSecurityMode, SecurityPolicy} from 'node-opcua'
// import {ClientService} from './client.service'
// import {SessionService} from './session.service'
// import {SubscriptService} from './subscript.service'

export module DbService {
    let dbPath = Config.dbPath
        ? Config.dbPath
        : Path.join(__dirname, "..", '..', "..", "/db/data.db").toString()
    export let db = new Database(dbPath, {verbose: console.log})
    export let defaultTableName: string = formatDateYMW(new Date())
    export let defaultFieldNames: IFieldNames = {
        serverF: 'Server',
        nodeIdF: 'NodeId',
        displayNameF: 'DisplayName',
        valueF: 'Value',
        dataTypeF: 'DataType',
        sourceTimestampF: 'SourceTimestamp',
        serverTimestampF: 'ServerTimestamp',
        statusCodeF: 'StatusCode',
    }
    export let events = new EventEmitter()


    export function init(createMode: TableCreateModes, tableName?: string, fields?: IFieldNames) {
        switch (createMode) {
            case TableCreateModes.default:
            case TableCreateModes.createPerWeek: {
                defaultTableName = formatDateYMW(new Date())
                break
            }
            case TableCreateModes.createPerDay: {
                defaultTableName = formatDateYMD(new Date())
                break
            }
            case TableCreateModes.createPerMonth: {
                defaultTableName = formatDateYM(new Date())
                break
            }
            case TableCreateModes.createPerYear: {
                defaultTableName = formatDateY(new Date())
            }
        }
        if (tableName) defaultTableName = tableName
        if (fields) defaultFieldNames = {...fields}
        MessageQueue.queueEvents.on('full', (dataList: MessageModel[]) => {
            DbService.insertMany(dataList)
        })
    }

    /**
     * @description 传入参数来插入数据,可以指定表名和字段名称
     * @param data
     */
    export function insert(data: IDbData) {
        let sql = `INSERT INTO ${defaultTableName}
                   (${defaultFieldNames.serverF}, ${defaultFieldNames.nodeIdF}, ${defaultFieldNames.displayNameF},
                    ${defaultFieldNames.valueF}, ${defaultFieldNames.dataTypeF}, ${defaultFieldNames.sourceTimestampF},
                    ${defaultFieldNames.serverTimestampF}, ${defaultFieldNames.statusCodeF})
                   VALUES (@server, @nodeId, @displayName, @value, @dataType, @sourceTimeStamp, @serverTimeStamp,
                           @statusCode)`
        let stmt = db.prepare(sql)
        stmt.run({data})
        events.emit('inserted')
    }

    /**
     * @description 连续写入多条数据,可以指定表名和字段名称
     * @param dataList
     */
    export function insertMany(dataList: IDbData[]) {
        let sql = `INSERT INTO ${defaultTableName}
                   (${defaultFieldNames.serverF}, ${defaultFieldNames.nodeIdF}, ${defaultFieldNames.displayNameF},
                    ${defaultFieldNames.valueF}, ${defaultFieldNames.dataTypeF}, ${defaultFieldNames.sourceTimestampF},
                    ${defaultFieldNames.serverTimestampF}, ${defaultFieldNames.statusCodeF})
                   VALUES (@server, @nodeId, @displayName, @value, @dataType, @sourceTimeStamp, @serverTimeStamp,
                           @statusCode)`
        let stmt = db.prepare(sql)
        let insert = db.transaction((params: IDbData[]) => {
            for (let param of params) {
                stmt.run({...param})
            }
        })
        insert(dataList)
        events.emit('insertedMany')
    }

    /**
     * @description 有问题急需修改
     * @param data
     */
    export function insertList(data: Map<string, MessageModel[]>) {
        let sql = `INSERT INTO ${defaultTableName}
                   (${defaultFieldNames.serverF}, ${defaultFieldNames.nodeIdF}, ${defaultFieldNames.displayNameF},
                    ${defaultFieldNames.valueF}, ${defaultFieldNames.dataTypeF}, ${defaultFieldNames.sourceTimestampF},
                    ${defaultFieldNames.serverTimestampF}, ${defaultFieldNames.statusCodeF})
                   VALUES (@server, @nodeId, @displayName, @value, @dataType, @sourceTimeStamp, @serverTimeStamp,
                           @statusCode)`
        let stmt = db.prepare(sql)
        let insert = db.transaction((params: MessageModel[]) => {
            for (let param of params) {
                stmt.run({...param})
            }
        })
        data.forEach((messages) => {
            insert(messages)
        })
        events.emit('insertedMany')
    }

    /**
     * @description 用于创建一个表,可以定制表名和字段名,输入即可,但注意sqlite3表命名规范
     * @param tableName
     * @param fieldNames
     */
    export function createTable(tableName?: string, fieldNames?: IFieldNames) {
        let table: string = defaultTableName
        let fields: IFieldNames = {...defaultFieldNames}
        if (tableName) table = tableName
        if (fieldNames) fields = fieldNames
        let sql = `create table if not exists ${table}
                   (
                       ${fields.serverF}          TEXT NOT NULL,
                       ${fields.nodeIdF}          TEXT NOT NULL,
                       ${fields.displayNameF}     TEXT NOT NULL,
                       ${fields.valueF}           TEXT NOT NULL,
                       ${fields.dataTypeF}        TEXT NOT NULL,
                       ${fields.sourceTimestampF} TEXT NOT NULL,
                       ${fields.serverTimestampF} TEXT NOT NULL,
                       ${fields.statusCodeF}      TEXT NOT NULL
                   )`
        let stmt = db.prepare(sql)
        stmt.run()
        events.emit('created', tableName)
    }

    export function configDb(fileName: string, options: Database.Options) {
        if (existsSync(fileName)) db = new Database(fileName, options)
    }

    export function closeDb() {
        db.close()
    }

    export async function backUp(fileName: string) {
        await db.backup(fileName)
    }
}


async function a() {
    ClientService.createClient({
        applicationName: 'NodeOPCUA-Client',
        connectionStrategy: {
            initialDelay: 1000,
            maxRetry: 1,
        },
        securityMode: MessageSecurityMode.None,
        securityPolicy: SecurityPolicy.None,
        endpointMustExist: false,
    })
    await ClientService.connectToServer('opc.tcp://WIN-4D29EPFU0V6:53530/OPCUA/SimulationServer')
    await SessionService.createSession()
    try {
        await CertificateService.createCertificate({
            "outputFile": "own/cert/self_signed_certificate.pem",
            "subject": {
                "commonName": "uaclient",
                "organization": "uaclient",
                "organizationalUnit": "uaclient",
                "locality": "uaclient",
                "state": "uaclient",
                "country": "uaclient",
                "domainComponent": "uaclient"
            },
            "applicationUri": "uaclient",
            "dns": ["WIN-4D29EPFU0V6"],
            "startDate": new Date(),
            "validity": 10
        })
    } catch (e: any) {
        console.log(e)
    }
    // console.log(await SessionService.readByNodeId({nodeId: 'ns=0;i=35'}))

    // console.log(await SessionService.browseByNodeIds([{nodeId: 'ns=3;i=1001'}]))
    // console.log(await SessionService.readByNodeIds([{nodeId: 'ns=3;i=1001'}]))
    // let a=await SessionService.browseRootFolder()
    // makeResultMask()
    // let rs=makeResultMask('BrowseName')
    // let rs = makeResultMask("ReferenceType | IsForward | BrowseName | NodeClass | TypeDefinition")
    // await SessionService.browse({nodeId: 'i=2253', resultMask: rs}, true)
    // SubscriptService.createSubscription()
    // SubscriptService.addMonitoredItem({
    //     itemToMonitor: {nodeId: 'ns=3;i=1001'},
    //     displayName: 'Counter',
    // })
    // UaMessageQueue.queueEvents.on('pushed', (data: MessageModel) => {
    //     console.log(data)
    // })
    // SessionService.session.browse('objects')
    // SessionService.session.getBuiltInDataType(new NodeId())
    // SessionService.session.readNamespaceArray()/
    // SessionService.session.browseNext()
    // await SubscriptService.createSubscription()
    // await SubscriptService.addMonitoredItem({ nodeId: 'ns=3;i=1003', attributeId: AttributeIds.Value })
}

// a()

// DataValue {
//     statusCode: ConstantStatusCode {
//         _value: 0,
//             _description: 'The operation succeeded.',
//             _name: 'Good'
//     },
//     sourceTimestamp: 2023-01-14T08:22:19.000Z {
//         high_low: [ 31008753, 1365258112 ],
//             picoseconds: 0
//     },
//     sourcePicoseconds: 0,
//     serverTimestamp: 2023-01-14T08:22:19.001Z {
//     high_low: [ 31008753, 1365268112 ],
//             picoseconds: 0
//     },
//     serverPicoseconds: 0,
//     value: Variant { dataType: 11, arrayType: 0, value: -0.4, dimensions: null }
// }
// let tableName=new Date().toLocaleDateString()
// console.log(tableName)
// let data={
//     name:1,
//     age:2
// }
// let s=`${...data}`
// console.log(s)
// DbService.createTable()
// DbService.insert({tableName:'_2023_01_16',values:{server:'niceServer',nodeId:'nodeid',displayName:'name',value:'12',serverTimeStamp:'sets',sourceTimeStamp:'sts',dataType:'type',statusCode:'good'}})
// console.log(new Date())
// DbService.insertMany([{
//     server: 'niceServer',
//     nodeId: 'nodeid3',
//     displayName: 'name',
//     value: '12',
//     serverTimeStamp: 'sets',
//     sourceTimeStamp: 'sts',
//     dataType: 'type',
//     statusCode: 'good'
// }, {
//     server: 'niceServer',
//     nodeId: 'nodeid2',
//     displayName: 'name',
//     value: '12',
//     serverTimeStamp: 'sets',
//     sourceTimeStamp: 'sts',
//     dataType: 'type',
//     statusCode: 'good'
// }])
// console.log(new Date())
