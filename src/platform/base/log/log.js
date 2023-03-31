"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = exports.ClientInfo = exports.ClientError = exports.ClientWarn = exports.InfoModel = void 0;
const electron_1 = require("electron");
const log4js_1 = require("log4js");
const config_1 = require("../../../client/config");
class InfoModel {
    constructor(source, information, message) {
        this.timeStamp = new Date().toLocaleString();
        this.source = source;
        this.information = information;
        this.message = message;
    }
}
exports.InfoModel = InfoModel;
class ClientWarn extends InfoModel {
    constructor(source, information, warn, message) {
        super(source, information, message);
        if (warn)
            this.warn = warn;
    }
}
exports.ClientWarn = ClientWarn;
class ClientError extends InfoModel {
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
    constructor(loggerName = "client", config) {
        this.configureLog(config);
    }
    static info(info) {
        try {
            Log.clientLogger.info(info.information, Object.assign({ source: info.source }, info.message));
            Log.events.emit("log:onInfo", info);
        }
        catch (e) {
            throw e;
        }
    }
    static error(info) {
        try {
            Log.clientLogger.error(info.information, Object.assign({ source: info.source, error: info.error, stack: info.trace }, info.message));
            Log.events.emit("log:onError", info);
        }
        catch (e) {
            throw e;
        }
    }
    static warn(info) {
        try {
            Log.clientLogger.warn(info.information, Object.assign({ source: info.source, warn: info.warn }, info.message));
            Log.events.emit("log:onWarn", info);
        }
        catch (e) {
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
                config_1.ClientConfig.set(config_1.ConfigNames.log, conf);
            }
            else {
                conf = {
                    appenders: {
                        client: {
                            type: "file",
                            filename: electron_1.app.getPath("appData") + "/logs/client.log",
                            maxLogSize: 50000, //文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
                        },
                    },
                    categories: { default: { appenders: ["client"], level: "info" } },
                };
                if (!config_1.ClientConfig.has(config_1.ConfigNames.log))
                    config_1.ClientConfig.set(config_1.ConfigNames.log, conf);
                (0, log4js_1.configure)(conf);
            }
        }
        catch (e) {
            throw e;
        }
    }
}
exports.Log = Log;
Log.clientLogger = (0, log4js_1.getLogger)("client");
Log.events = electron_1.ipcMain;
// export module Log {
//     type loggerName = string
//     let clientLogger: Logger = getLogger("client")
//     let events = ipcMain
//     export function init(loggerName: loggerName = "client", config?: Configuration) {
//         configureLog(config)
//     }
//     export function info(info: ClientInfo) {
//         try {
//             clientLogger.info(info.information, { source: info.source, ...info.message })
//             events.emit("log:onInfo", info)
//         } catch (e: any) {
//             throw e
//         }
//     }
//     export function error(info: ClientError) {
//         try {
//             clientLogger.error(info.information, {
//                 source: info.source,
//                 error: info.error,
//                 stack: info.trace,
//                 ...info.message,
//             })
//             events.emit("log:onError", info)
//         } catch (e: any) {
//             throw e
//         }
//     }
//     export function warn(info: ClientWarn) {
//         try {
//             clientLogger.warn(info.information, { source: info.source, warn: info.warn, ...info.message })
//             events.emit("log:onWarn", info)
//         } catch (e: any) {
//             throw e
//         }
//     }
//     /**
//      * @description 具体参考log4js配置方法
//      * @param conf
//      */
//     export function configureLog(conf?: Configuration) {
//         try {
//             if (conf) {
//                 ClientConfig.set(ConfigNames.log, conf)
//             } else {
//                 conf = {
//                     appenders: {
//                         client: {
//                             type: "file",
//                             filename: app.getPath("appData") + "/logs/client.log",
//                             maxLogSize: 50000, //文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
//                         },
//                     },
//                     categories: { default: { appenders: ["client"], level: "info" } },
//                 }
//                 if (!ClientConfig.has(ConfigNames.log)) ClientConfig.set(ConfigNames.log, conf)
//                 configure(conf)
//             }
//         } catch (e: any) {
//             throw e
//         }
//     }
// }
//todo 安装时,应当初始化log和database服务
//todo 添加socket服务以供更多程序使用
