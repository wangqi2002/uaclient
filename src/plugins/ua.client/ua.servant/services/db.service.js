"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.DbService = void 0;
const ua_enums_1 = require("../../common/ua.enums");
const config_default_1 = require("../../config/config.default");
const util_1 = require("../utils/util");
const log_1 = require("../../../../platform/base/log/log");
const persistence_1 = require("../../../../platform/base/persist/persistence");
const sequelize_1 = require("sequelize");
const events_1 = __importDefault(require("events"));
const ipc_handler_1 = require("../../../../platform/ipc/handlers/ipc.handler");
//todo 全面测试数据库模块
var DbService;
(function (DbService) {
    DbService.defaultTableName = config_default_1.Config.defaultTable;
    DbService.defaultAttributes = config_default_1.Config.defaultAttributes;
    DbService.events = new events_1.default();

    /**
     * @description 用于初始化database,如果表名不存在则创建一个新表
     * @param createMode
     * @param tableName
     * @param fields
     */
    async function init(createMode, tableName, fields) {
        try {
            switch (createMode) {
                case ua_enums_1.TableCreateModes.default:
                case ua_enums_1.TableCreateModes.createPerWeek: {
                    DbService.defaultTableName = util_1.DbUtils.formatDateYMW(new Date());
                    break;
                }
                case ua_enums_1.TableCreateModes.createPerDay: {
                    DbService.defaultTableName = util_1.DbUtils.formatDateYMD(new Date());
                    break;
                }
                case ua_enums_1.TableCreateModes.createPerMonth: {
                    DbService.defaultTableName = util_1.DbUtils.formatDateYM(new Date());
                    break;
                }
                case ua_enums_1.TableCreateModes.createPerYear: {
                    DbService.defaultTableName = util_1.DbUtils.formatDateY(new Date());
                    break;
                }
                case ua_enums_1.TableCreateModes.customTableName:
                case ua_enums_1.TableCreateModes.customField:
                case ua_enums_1.TableCreateModes.customBoth: {
                    if (tableName)
                        DbService.defaultTableName = tableName;
                    if (fields) {
                        DbService.defaultAttributes = {
                            server: {
                                type: sequelize_1.DataTypes.STRING,
                                allowNull: false,
                                field: fields.serverF,
                            },
                            nodeId: {
                                type: sequelize_1.DataTypes.STRING,
                                allowNull: false,
                                field: fields.nodeIdF,
                            },
                            displayName: {
                                type: sequelize_1.DataTypes.STRING,
                                allowNull: false,
                                field: fields.displayNameF,
                            },
                            value: {
                                type: sequelize_1.DataTypes.STRING,
                                allowNull: false,
                                field: fields.valueF,
                            },
                            dataType: {
                                type: sequelize_1.DataTypes.STRING,
                                allowNull: false,
                                field: fields.dataTypeF,
                            },
                            sourceTimestamp: {
                                type: sequelize_1.DataTypes.STRING,
                                allowNull: false,
                                field: fields.sourceTimestampF,
                            },
                            serverTimestamp: {
                                type: sequelize_1.DataTypes.STRING,
                                allowNull: false,
                                field: fields.serverTimestampF,
                            },
                            statusCode: {
                                type: sequelize_1.DataTypes.STRING,
                                allowNull: false,
                                field: fields.statusCodeF,
                            },
                        };
                    }
                    break;
                }
                default:
                    throw new log_1.ClientError(ua_enums_1.UaSources.dbService, ua_enums_1.UaErrors.errorTableMode);
            }
            await DbService.createTable();
            // let pipe = Broker.createPipe(Config.defaultPipeName)
            // // let events = Broker.getPipeEvents(Config.defaultPipeName)
            // pipe.on("full", (data: any) => {
            //     DbService.insertMany(data)
            // })
            ipc_handler_1.ipcClient.onLocal('pipe:ua.full', (data) => {
                DbService.insertMany(data);
            });
            //todo 注意这里ipcClient的使用
            DbService.events.on("init", () => {
                console.log("yes");
            });
        } catch (e) {
            throw new log_1.ClientError(ua_enums_1.UaSources.dbService, ua_enums_1.UaErrors.errorCreateClient, e.message, e.stack);
        }
    }

    DbService.init = init;

    /**
     * @description 传入参数来插入数据,可以指定表名和字段名称
     * @param data
     */
    async function insert(data) {
        try {
            await persistence_1.Persistence.insert(data);
        } catch (e) {
            throw new log_1.ClientError(ua_enums_1.UaSources.dbService, ua_enums_1.UaErrors.errorInsert, e.message, e.stack);
        }
    }

    DbService.insert = insert;

    /**
     * @description 连续写入多条数据
     * @param dataList
     */
    async function insertMany(dataList) {
        try {
            await persistence_1.Persistence.insertMany(dataList);
        } catch (e) {
            throw new log_1.ClientError(ua_enums_1.UaSources.dbService, ua_enums_1.UaErrors.errorInsert, e.message, e.stack);
        }
    }

    DbService.insertMany = insertMany;

    /**
     * @description 用于创建一个表,可以定制表名和字段名,输入即可,但注意sqlite3表命名规范
     * @param tableName
     * @param attributes
     */
    async function createTable(tableName, attributes) {
        try {
            let table = tableName ? tableName : DbService.defaultTableName;
            let attribute = attributes ? attributes : DbService.defaultAttributes;
            await persistence_1.Persistence.configureDb(table, attribute);
        } catch (e) {
            throw new log_1.ClientError(ua_enums_1.UaSources.dbService, ua_enums_1.UaErrors.errorCreatTable, e.message, e.stack);
        }
    }

    DbService.createTable = createTable;
})(DbService = exports.DbService || (exports.DbService = {}));
