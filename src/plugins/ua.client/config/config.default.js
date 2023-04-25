"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.Config = void 0;
const node_opcua_1 = require("node-opcua");
const util_js_1 = require("../ua.servant/utils/util.js");
const path_1 = __importDefault(require("path"));
const sequelize_1 = require("sequelize");
const dotenv = require('dotenv');
let Path = require('path');
var Config;
(function (Config) {
    dotenv.config({
        path: Path.join(__dirname, '..', '..', '..', '..', '.env').toString(),
    });
    Config.port = process.env.APP_PORT ? process.env.APP_PORT : 3030;
    Config.mqLength = process.env.MQ_LENGTH ? process.env.MQ_LENGTH : 200;
    Config.dbPath = Path.join(__dirname, '..', '..', '..', '..', process.env.DB_PATH)
        ? Path.join(__dirname, '..', '..', '..', '..', process.env.DB_PATH).toString()
        : Path.join(__dirname, '..', '..', '..', '..', '/databases/data.db').toString();
    Config.defaultTable = util_js_1.DbUtils.formatDateYMW(new Date());
    Config.certRoot = path_1.default.join(__dirname, '..', '..', 'ua.client', 'certificates', 'PKI');
    Config.defaultAttributes = {
        server: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            field: 'server',
        },
        nodeId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            field: 'nodeId',
        },
        displayName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            field: 'displayName',
        },
        value: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            field: 'value',
        },
        dataType: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            field: 'dataType',
        },
        sourceTimestamp: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            field: 'sourceTimestamp',
        },
        serverTimestamp: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            field: 'serverTimestamp',
        },
        statusCode: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            field: 'statusCode',
        },
    };
    Config.defaultClient = {
        applicationName: 'NodeOPCUA-Client',
        connectionStrategy: {
            initialDelay: 1000,
            maxRetry: 10,
        },
        keepSessionAlive: true,
        securityMode: node_opcua_1.MessageSecurityMode.None,
        securityPolicy: node_opcua_1.SecurityPolicy.None,
        endpointMustExist: false,
        requestedSessionTimeout: 3600,
    };
    Config.defaultSubscript = {
        requestedLifetimeCount: 60,
        requestedPublishingInterval: 100,
        requestedMaxKeepAliveCount: 10,
        publishingEnabled: true,
        maxNotificationsPerPublish: 100,
        priority: 1,
    };
    Config.defaultLog = {
        appenders: {
            client: {
                type: 'file',
                filename: Path.join(__dirname, '..', '..', '..', '..', '/logs/client.log'),
                maxLogSize: 50000, //文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
            },
        },
        categories: {default: {appenders: ['client'], level: 'info'}},
    };
    Config.defaultPipeName = 'ua';
})(Config = exports.Config || (exports.Config = {}));
