import { TableCreateModes, UaErrors, UaSources } from "../../common/ua.enums";
import { Config } from "../../config/config.default";
import { DbUtils } from "../utils/util";
import { ClientError } from "../../../../platform/base/log/log";
import { Persistence } from "../../../../platform/base/persist/persistence";
import { DataTypes } from "sequelize";
import EventEmitter from "events";
import { Broker } from "../../../../platform/base/broker/broker";
//todo 全面测试数据库模块
export var DbService;
(function (DbService) {
    DbService.defaultTableName = Config.defaultTable;
    DbService.defaultAttributes = Config.defaultAttributes;
    DbService.events = new EventEmitter();
    /**
     * @description 用于初始化database,如果表名不存在则创建一个新表
     * @param createMode
     * @param tableName
     * @param fields
     */
    async function init(createMode, tableName, fields) {
        try {
            switch (createMode) {
                case TableCreateModes.default:
                case TableCreateModes.createPerWeek: {
                    DbService.defaultTableName = DbUtils.formatDateYMW(new Date());
                    break;
                }
                case TableCreateModes.createPerDay: {
                    DbService.defaultTableName = DbUtils.formatDateYMD(new Date());
                    break;
                }
                case TableCreateModes.createPerMonth: {
                    DbService.defaultTableName = DbUtils.formatDateYM(new Date());
                    break;
                }
                case TableCreateModes.createPerYear: {
                    DbService.defaultTableName = DbUtils.formatDateY(new Date());
                    break;
                }
                case TableCreateModes.customTableName:
                case TableCreateModes.customField:
                case TableCreateModes.customBoth: {
                    if (tableName)
                        DbService.defaultTableName = tableName;
                    if (fields) {
                        DbService.defaultAttributes = {
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
                        };
                    }
                    break;
                }
                default:
                    throw new ClientError(UaSources.dbService, UaErrors.errorTableMode);
            }
            await DbService.createTable();
            let pipe = Broker.createPipe(Config.defaultPipeName);
            // let events = Broker.getPipeEvents(Config.defaultPipeName)
            pipe.on("full", (data) => {
                DbService.insertMany(data);
            });
            DbService.events.on("init", () => {
                console.log("yes");
            });
        }
        catch (e) {
            throw new ClientError(UaSources.dbService, UaErrors.errorCreateClient, e.message, e.stack);
        }
    }
    DbService.init = init;
    /**
     * @description 传入参数来插入数据,可以指定表名和字段名称
     * @param data
     */
    async function insert(data) {
        try {
            await Persistence.insert(data);
        }
        catch (e) {
            throw new ClientError(UaSources.dbService, UaErrors.errorInsert, e.message, e.stack);
        }
    }
    DbService.insert = insert;
    /**
     * @description 连续写入多条数据
     * @param dataList
     */
    async function insertMany(dataList) {
        try {
            await Persistence.insertMany(dataList);
        }
        catch (e) {
            throw new ClientError(UaSources.dbService, UaErrors.errorInsert, e.message, e.stack);
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
            await Persistence.configureDb(table, attribute);
        }
        catch (e) {
            throw new ClientError(UaSources.dbService, UaErrors.errorCreatTable, e.message, e.stack);
        }
    }
    DbService.createTable = createTable;
})(DbService || (DbService = {}));
