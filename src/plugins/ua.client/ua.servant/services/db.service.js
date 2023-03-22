"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }

    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.DbService = void 0;
const ua_enums_1 = require("../../common/ua.enums");
const config_default_1 = require("../../config/config.default");
const util_1 = require("../utils/util");
const log_1 = require("../../../../platform/base/log");
const persistence_1 = require("../../../../platform/base/persistence");
const sequelize_1 = require("sequelize");
const events_1 = __importDefault(require("events"));
const broker_1 = require("../../../../platform/base/broker");
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
    function init(createMode, tableName, fields) {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield DbService.createTable();
                broker_1.Broker.createPipe(config_default_1.Config.defaultPipeName);
                let events = broker_1.Broker.getPipeEvents(config_default_1.Config.defaultPipeName);
                events === null || events === void 0 ? void 0 : events.on('full', (data) => {
                    DbService.insertMany(data);
                });
                DbService.events.on('init', () => {
                    console.log('yes');
                });
            } catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.dbService, ua_enums_1.UaErrors.errorCreateClient, e.message, e.stack);
            }
        });
    }

    DbService.init = init;

    /**
     * @description 传入参数来插入数据,可以指定表名和字段名称
     * @param data
     */
    function insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield persistence_1.Persistence.insert(data);
            } catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.dbService, ua_enums_1.UaErrors.errorInsert, e.message, e.stack);
            }
        });
    }

    DbService.insert = insert;

    /**
     * @description 连续写入多条数据
     * @param dataList
     */
    function insertMany(dataList) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield persistence_1.Persistence.insertMany(dataList);
            } catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.dbService, ua_enums_1.UaErrors.errorInsert, e.message, e.stack);
            }
        });
    }

    DbService.insertMany = insertMany;

    /**
     * @description 用于创建一个表,可以定制表名和字段名,输入即可,但注意sqlite3表命名规范
     * @param tableName
     * @param attributes
     */
    function createTable(tableName, attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let table = tableName ? tableName : DbService.defaultTableName;
                let attribute = attributes ? attributes : DbService.defaultAttributes;
                yield persistence_1.Persistence.init(table, attribute);
            } catch (e) {
                throw new log_1.ClientError(ua_enums_1.UaSources.dbService, ua_enums_1.UaErrors.errorCreatTable, e.message, e.stack);
            }
        });
    }

    DbService.createTable = createTable;
})(DbService = exports.DbService || (exports.DbService = {}));
