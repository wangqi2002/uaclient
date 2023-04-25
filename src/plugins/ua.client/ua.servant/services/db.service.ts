import {TableCreateModes, UaErrors, UaSources} from "../../common/ua.enums"
import {Config} from "../../config/config.default"
import {DbUtils} from "../utils/util"
import {IDbData, IFieldNames} from "../models/params.model"
import {ClientError} from "../../../../platform/base/log/log"
import {Persistence} from "../../../../platform/base/persist/persistence"
import {DataTypes} from "sequelize"
import EventEmitter from "events"
import path from "path"
import {UaMessage} from '../models/message.model'
import {ipcClient} from '../../../../platform/ipc/handlers/ipc.handler'
//todo 全面测试数据库模块
export module DbService {
    export let defaultTableName: string = Config.defaultTable
    export let defaultAttributes: any = Config.defaultAttributes
    export let events = new EventEmitter()

    /**
     * @description 用于初始化database,如果表名不存在则创建一个新表
     * @param createMode
     * @param tableName
     * @param fields
     */
    export async function init(createMode: TableCreateModes, tableName?: string, fields?: IFieldNames) {
        try {
            switch (createMode) {
                case TableCreateModes.default:
                case TableCreateModes.createPerWeek: {
                    defaultTableName = DbUtils.formatDateYMW(new Date())
                    break
                }
                case TableCreateModes.createPerDay: {
                    defaultTableName = DbUtils.formatDateYMD(new Date())
                    break
                }
                case TableCreateModes.createPerMonth: {
                    defaultTableName = DbUtils.formatDateYM(new Date())
                    break
                }
                case TableCreateModes.createPerYear: {
                    defaultTableName = DbUtils.formatDateY(new Date())
                    break
                }
                case TableCreateModes.customTableName:
                case TableCreateModes.customField:
                case TableCreateModes.customBoth: {
                    if (tableName) defaultTableName = tableName
                    if (fields) {
                        defaultAttributes = {
                            server: {
                                type: DataTypes.STRING,
                                allowNull: false,
                                field: fields.serverF,
                            },
                            nodeId: {
                                type: DataTypes.STRING,
                                allowNull: false,
                                field: fields.nodeIdF,
                            },
                            displayName: {
                                type: DataTypes.STRING,
                                allowNull: false,
                                field: fields.displayNameF,
                            },
                            value: {
                                type: DataTypes.STRING,
                                allowNull: false,
                                field: fields.valueF,
                            },
                            dataType: {
                                type: DataTypes.STRING,
                                allowNull: false,
                                field: fields.dataTypeF,
                            },
                            sourceTimestamp: {
                                type: DataTypes.STRING,
                                allowNull: false,
                                field: fields.sourceTimestampF,
                            },
                            serverTimestamp: {
                                type: DataTypes.STRING,
                                allowNull: false,
                                field: fields.serverTimestampF,
                            },
                            statusCode: {
                                type: DataTypes.STRING,
                                allowNull: false,
                                field: fields.statusCodeF,
                            },
                        }
                    }
                    break
                }
                default:
                    throw new ClientError(UaSources.dbService, UaErrors.errorTableMode)
            }
            await DbService.createTable()

            // let pipe = Broker.createPipe(Config.defaultPipeName)
            // // let events = Broker.getPipeEvents(Config.defaultPipeName)
            // pipe.on("full", (data: any) => {
            //     DbService.insertMany(data)
            // })
            ipcClient.onLocal('pipe:ua.full', (data: UaMessage[]) => {
                DbService.insertMany(data)
            })
            //todo 注意这里ipcClient的使用
            DbService.events.on("init", () => {
                console.log("yes")
            })
        } catch (e: any) {
            throw new ClientError(UaSources.dbService, UaErrors.errorCreateClient, e.message, e.stack)
        }
    }

    /**
     * @description 传入参数来插入数据,可以指定表名和字段名称
     * @param data
     */
    export async function insert(data: IDbData) {
        try {
            await Persistence.insert(data)
        } catch (e: any) {
            throw new ClientError(UaSources.dbService, UaErrors.errorInsert, e.message, e.stack)
        }
    }

    /**
     * @description 连续写入多条数据
     * @param dataList
     */
    export async function insertMany(dataList: IDbData[]) {
        try {
            await Persistence.insertMany(dataList)
        } catch (e: any) {
            throw new ClientError(UaSources.dbService, UaErrors.errorInsert, e.message, e.stack)
        }
    }

    /**
     * @description 用于创建一个表,可以定制表名和字段名,输入即可,但注意sqlite3表命名规范
     * @param tableName
     * @param attributes
     */
    export async function createTable(tableName?: string, attributes?: any) {
        try {
            let table = tableName ? tableName : defaultTableName
            let attribute = attributes ? attributes : defaultAttributes
            await Persistence.configureDb(table, attribute)
        } catch (e: any) {
            throw new ClientError(UaSources.dbService, UaErrors.errorCreatTable, e.message, e.stack)
        }
    }
}
