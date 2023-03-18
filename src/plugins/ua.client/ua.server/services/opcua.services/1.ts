// import {UaErrors, UaSources, TableCreateModes, UaWarns} from '../../../common/ua.enums'
// import {Config} from '../../../config/config.default'
// import {existsSync} from 'fs'
// import {DbUtils} from '../../utils/util'
// import {IDbData, IFieldNames} from '../../models/params.model'
// import {ClientError, ClientWarn} from '../../../../../platform/log'
// import Database = require('better-sqlite3')
// import {DataService} from '../../../../../platform/database'
// //todo 全面测试数据库模块
// export module DbService {
//     export let db = new Database(Config.dbPath, {verbose: console.log})
//     export let defaultTableName: string = Config.defaultTable
//     export let defaultFieldNames: IFieldNames = Config.defaultFieldNames
//     let sql_insertMany = ''
//     let stmt_insertMany: any
//
//     // export let events = new EventEmitter()
//     /**
//      * @description 初始化statement,专门用于insertMany的statement
//      * @param sqlChoose
//      * @private
//      */
//     function initStmt(sqlChoose: string) {
//         try {
//             switch (sqlChoose) {
//                 case 'many': {
//                     sql_insertMany = `INSERT INTO ${defaultTableName}
//                                       (${defaultFieldNames.serverF}, ${defaultFieldNames.nodeIdF},
//                                        ${defaultFieldNames.displayNameF},
//                                        ${defaultFieldNames.valueF}, ${defaultFieldNames.dataTypeF},
//                                        ${defaultFieldNames.sourceTimestampF},
//                                        ${defaultFieldNames.serverTimestampF}, ${defaultFieldNames.statusCodeF})
//                                       VALUES (@server, @nodeId, @displayName, @value, @dataType, @sourceTimestamp,
//                                               @serverTimestamp,
//                                               @statusCode)`
//                     stmt_insertMany = db.prepare(sql_insertMany)
//                     break
//                 }
//             }
//         } catch (e: any) {
//             throw new ClientError(UaSources.dbService, UaErrors.errorInitStmt, e.message, e.stack)
//         }
//     }
//
//     /**
//      * @description 用于初始化database,如果表名不存在则创建一个新表
//      * @param createMode
//      * @param tableName
//      * @param fields
//      */
//     export function init(createMode: TableCreateModes, tableName?: string, fields?: IFieldNames) {
//         switch (createMode) {
//             case TableCreateModes.default:
//             case TableCreateModes.createPerWeek: {
//                 defaultTableName = DbUtils.formatDateYMW(new Date())
//                 break
//             }
//             case TableCreateModes.createPerDay: {
//                 defaultTableName = DbUtils.formatDateYMD(new Date())
//                 break
//             }
//             case TableCreateModes.createPerMonth: {
//                 defaultTableName = DbUtils.formatDateYM(new Date())
//                 break
//             }
//             case TableCreateModes.createPerYear: {
//                 defaultTableName = DbUtils.formatDateY(new Date())
//                 break
//             }
//             case TableCreateModes.customTableName:
//             case TableCreateModes.customField:
//             case TableCreateModes.customBoth: {
//                 if (tableName) defaultTableName = tableName
//                 if (fields) defaultFieldNames = {...fields}
//                 break
//             }
//             default:
//                 throw new ClientError(UaSources.dbService, UaErrors.errorTableMode)
//         }
//         if (!db.prepare(`SELECT * FROM sqlite_master where type='table' and name='${defaultTableName}'`).get()) {
//             createTable(tableName, fields)
//         }
//         initStmt('many')
//     }
//
//     /**
//      * @description 传入参数来插入数据,可以指定表名和字段名称
//      * @param data
//      */
//     export function insert(data: IDbData) {
//         try {
//             // let sql = `INSERT INTO ${defaultTableName}
//             //            (${defaultFieldNames.serverF}, ${defaultFieldNames.nodeIdF},
//             //             ${defaultFieldNames.displayNameF},
//             //             ${defaultFieldNames.valueF}, ${defaultFieldNames.dataTypeF},
//             //             ${defaultFieldNames.sourceTimestampF},
//             //             ${defaultFieldNames.serverTimestampF}, ${defaultFieldNames.statusCodeF})
//             //            VALUES (@server, @nodeId, @displayName, @value, @dataType, @sourceTimestamp,
//             //                    @serverTimestamp,
//             //                    @statusCode)`
//             // let stmt = db.prepare(sql)
//             // stmt.run({...data})
//             // // events.emit('inserted')
//             DataService.insert('data',data)
//         } catch (e: any) {
//             throw new ClientError(UaSources.dbService, UaErrors.errorInsert, e.message, e.stack)
//         }
//     }
//
//     /**
//      * @description 连续写入多条数据
//      * @param dataList
//      */
//     export function insertMany(dataList: IDbData[]) {
//         try {
//             let insert = db.transaction((dbData: IDbData[]) => {
//                 for (let param of dbData) {
//                     stmt_insertMany.run({...param})
//                 }
//             })
//             insert(dataList)
//             // events.emit('insertedMany')
//         } catch (e: any) {
//             throw new ClientError(UaSources.dbService, UaErrors.errorInsert, e.message, e.stack)
//         }
//     }
//
//     /**
//      * @description 用于创建一个表,可以定制表名和字段名,输入即可,但注意sqlite3表命名规范
//      * @param tableName
//      * @param fieldNames
//      */
//     export function createTable(tableName?: string, fieldNames?: IFieldNames) {
//         try {
//             let table: string = defaultTableName
//             let fields: IFieldNames = {...defaultFieldNames}
//             if (tableName) table = tableName
//             if (fieldNames) fields = fieldNames
//             let sql = `create table if not exists ${table}
//                        (
//                            ${fields.serverF}          TEXT NOT NULL,
//                            ${fields.nodeIdF}          TEXT NOT NULL,
//                            ${fields.displayNameF}     TEXT NOT NULL,
//                            ${fields.valueF}           TEXT NOT NULL,
//                            ${fields.dataTypeF}        TEXT NOT NULL,
//                            ${fields.sourceTimestampF} TEXT NOT NULL,
//                            ${fields.serverTimestampF} TEXT NOT NULL,
//                            ${fields.statusCodeF}      TEXT NOT NULL
//                        )`
//             let stmt = db.prepare(sql)
//             stmt.run()
//             // events.emit('created', tableName)
//         } catch (e: any) {
//             throw new ClientError(UaSources.dbService, UaErrors.errorCreatTable, e.message, e.stack)
//         }
//     }
//
//     export function configDb(fileName: string, options: Database.Options) {
//         try {
//             if (existsSync(fileName)) {
//                 db = new Database(fileName, options)
//             } else {
//                 throw new ClientWarn(UaSources.dbService, UaWarns.pathNotExist)
//             }
//         } catch (e: any) {
//             throw new ClientError(UaSources.dbService, UaErrors.errorConfigDb, e.message, e.stack)
//         }
//     }
//
//     export function closeDb() {
//         try {
//             db.close()
//         } catch (e: any) {
//             throw new ClientError(UaSources.dbService, UaErrors.errorCloseDb, e.message, e.stack)
//         }
//     }
//
//     export async function backUp(fileName: string) {
//         try {
//             await db.backup(fileName)
//         } catch (e: any) {
//             throw new ClientError(UaSources.dbService, UaErrors.errorBackUp, e.message, e.stack)
//         }
//     }
// }