import { MessageSecurityMode, SecurityPolicy } from 'node-opcua';
import { DbUtils } from '../ua.servant/utils/util.js';
import path from 'path';
import { DataTypes } from 'sequelize';
import { FileTransfer } from '../../../client/path/path.js';
const dotenv = require('dotenv');
let Path = require('path');
export var Config;
(function (Config) {
    dotenv.config({
        path: Path.join(FileTransfer.dirname(import.meta.url), '..', '..', '..', '..', '.env').toString(),
    });
    Config.port = process.env.APP_PORT ? process.env.APP_PORT : 3030;
    Config.mqLength = process.env.MQ_LENGTH ? process.env.MQ_LENGTH : 200;
    Config.dbPath = Path.join(FileTransfer.dirname(import.meta.url), '..', '..', '..', '..', process.env.DB_PATH)
        ? Path.join(FileTransfer.dirname(import.meta.url), '..', '..', '..', '..', process.env.DB_PATH).toString()
        : Path.join(FileTransfer.dirname(import.meta.url), '..', '..', '..', '..', '/databases/data.db').toString();
    Config.defaultTable = DbUtils.formatDateYMW(new Date());
    Config.certRoot = path.join(FileTransfer.dirname(import.meta.url), '..', '..', 'ua.client', 'certificates', 'PKI');
    Config.defaultAttributes = {
        server: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'server',
        },
        nodeId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'nodeId',
        },
        displayName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'displayName',
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'value',
        },
        dataType: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'dataType',
        },
        sourceTimestamp: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'sourceTimestamp',
        },
        serverTimestamp: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'serverTimestamp',
        },
        statusCode: {
            type: DataTypes.STRING,
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
        securityMode: MessageSecurityMode.None,
        securityPolicy: SecurityPolicy.None,
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
                filename: Path.join(FileTransfer.dirname(import.meta.url), '..', '..', '..', '..', '/logs/client.log'),
                maxLogSize: 50000, //文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
            },
        },
        categories: { default: { appenders: ['client'], level: 'info' } },
    };
    Config.defaultPipeName = 'ua';
})(Config || (Config = {}));
