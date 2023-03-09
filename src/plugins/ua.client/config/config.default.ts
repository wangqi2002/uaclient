import {MessageSecurityMode, SecurityPolicy} from 'node-opcua'
import {DbUtils} from '../ua.server/utils/util'
import path from 'path'

const dotenv = require('dotenv')
let Path = require('path')
export module Config {
    dotenv.config({
        path: Path.join(__dirname, "..", "..", "..", "..", ".env").toString()
    })

    export let port = process.env.APP_PORT
        ? process.env.APP_PORT
        : 3030

    export let mqLength = process.env.MQ_LENGTH
        ? process.env.MQ_LENGTH
        : 200

    export let dbPath = Path.join(__dirname, "..", "..", "..", "..", process.env.DB_PATH)
        ? Path.join(__dirname, "..", "..", "..", "..", process.env.DB_PATH).toString()
        : Path.join(__dirname, "..", "..", "..", "..", "/databases/data.db").toString()
    export let defaultTable = DbUtils.formatDateYMW(new Date())
    export let certRoot = path.join(__dirname, '..', '..', 'ua.client', 'certificates', 'PKI')
    export let defaultFieldNames = {
        serverF: 'Server',
        nodeIdF: 'NodeId',
        displayNameF: 'DisplayName',
        valueF: 'Value',
        dataTypeF: 'DataType',
        sourceTimestampF: 'SourceTimestamp',
        serverTimestampF: 'ServerTimestamp',
        statusCodeF: 'StatusCode',
    }

    export let defaultClient = {
        applicationName: 'NodeOPCUA-Client',
        connectionStrategy: {
            initialDelay: 1000,
            maxRetry: 10,
        },
        keepSessionAlive: true,
        securityMode: MessageSecurityMode.None,
        securityPolicy: SecurityPolicy.None,
        endpointMustExist: false,
        requestedSessionTimeout: 3600,
    }

    export let defaultSubscript = {
        requestedLifetimeCount: 60,
        requestedPublishingInterval: 100,
        requestedMaxKeepAliveCount: 10,
        publishingEnabled: true,
        maxNotificationsPerPublish: 100,
        priority: 1,
    }

    export let defaultLog = {
        appenders: {
            client: {
                type: 'file',
                filename: Path.join(__dirname, "..", "..", "..", "..", '/logs/client.log'),
                maxLogSize: 20000,//文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
            }
        },
        categories: {default: {appenders: ['client'], level: 'info'}}
    }
}