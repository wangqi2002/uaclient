"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.Log = exports.ClientInfo = exports.ClientError = exports.ClientWarn = exports.InfoModel = void 0;
const electron_1 = require("electron");
const log4js_1 = __importDefault(require("log4js"));
const {configure, getLogger} = log4js_1.default;
const ipc_events_js_1 = require("../../ipc/events/ipc.events.js");
const ipc_handler_js_1 = require("../../ipc/handlers/ipc.handler.js");
const store_js_1 = require("../../../client/store/store.js");

class InfoModel {
    timeStamp;
    source;
    information;
    message;

    constructor(source, information, message) {
        this.timeStamp = new Date().toLocaleString();
        this.source = source;
        this.information = information;
        this.message = message;
    }
}

exports.InfoModel = InfoModel;

class ClientWarn extends InfoModel {
    warn;

    constructor(source, information, warn, message) {
        super(source, information, message);
        if (warn)
            this.warn = warn;
    }
}

exports.ClientWarn = ClientWarn;

class ClientError extends InfoModel {
    error;
    trace;

    constructor(source, information, error, trace) {
        super(source, information);
        if (error)
            this.error = error;
        if (trace)
            this.trace = trace;
    }
}

exports.ClientError = ClientError;

class ClientInfo extends InfoModel {
    constructor(source, information, message) {
        super(source, information, message);
    }
}

exports.ClientInfo = ClientInfo;

class Log {
    static clientLogger = getLogger('client');

    constructor(loggerName = 'client', config) {
        this.configureLog(config);
        this.initBind();
    }

    static info(info) {
        try {
            Log.clientLogger.info(info.information, {source: info.source, ...info.message});
            ipc_handler_js_1.ipcClient.emitToRender(ipc_events_js_1.MainEvents.logEmitEvents.info, info);
        } catch (e) {
            throw e;
        }
    }

    static error(info) {
        try {
            Log.clientLogger.error(info.information, {
                source: info.source,
                error: info.error,
                stack: info.trace,
                ...info.message,
            });
            ipc_handler_js_1.ipcClient.emitToRender(ipc_events_js_1.MainEvents.logEmitEvents.error, info);
        } catch (e) {
            throw e;
        }
    }

    static warn(info) {
        try {
            Log.clientLogger.warn(info.information, {source: info.source, warn: info.warn, ...info.message});
            ipc_handler_js_1.ipcClient.emitToRender(ipc_events_js_1.MainEvents.logEmitEvents.warn, info);
        } catch (e) {
            throw e;
        }
    }

    /**
     * @description 具体参考log4js配置方法
     * @param conf
     */
    configureLog(conf) {
        try {
            if (conf) {
                store_js_1.ClientStore.set('config', store_js_1.ConfigNames.log, conf);
            } else {
                conf = {
                    appenders: {
                        client: {
                            type: 'file',
                            filename: electron_1.app.getPath('appData') + '/logs/client.log',
                            maxLogSize: 50000, //文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
                        },
                    },
                    categories: {default: {appenders: ['client'], level: 'info'}},
                };
                if (!store_js_1.ClientStore.has('config', store_js_1.ConfigNames.log))
                    store_js_1.ClientStore.set('config', store_js_1.ConfigNames.log, conf);
                configure(conf);
            }
        } catch (e) {
            throw e;
        }
    }

    initBind() {
        ipc_handler_js_1.ipcClient.on(ipc_events_js_1.rendererEvents.logEvents.info, (event, args) => {
            Log.info(args);
        });
        ipc_handler_js_1.ipcClient.on(ipc_events_js_1.rendererEvents.logEvents.error, (event, args) => {
            Log.error(args);
        });
        ipc_handler_js_1.ipcClient.on(ipc_events_js_1.rendererEvents.logEvents.warn, (event, args) => {
            Log.warn(args);
        });
    }
}

exports.Log = Log;
//todo 安装时,应当初始化log和database服务
