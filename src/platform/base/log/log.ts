import { app, ipcMain, ipcRenderer } from "electron"
import { Configuration, configure, getLogger, Logger } from "log4js"
import { ClientConfig, ConfigNames } from "../../../client/config"

type Source = string | undefined
type Warn = string
type Error = string
type Info = string
type loggerName = string

export class InfoModel {
    timeStamp: string
    source: Source
    information: string
    message?: object

    constructor(source: Source, information: string, message?: object) {
        this.timeStamp = new Date().toLocaleString()
        this.source = source
        this.information = information
        this.message = message
    }
}

export class ClientWarn extends InfoModel {
    warn?: string

    constructor(source: string, information: Warn, warn?: string, message?: object) {
        super(source, information, message)
        if (warn) this.warn = warn
    }
}

export class ClientError extends InfoModel {
    error?: string
    trace?: string

    constructor(source: string, information: Error, error?: string, trace?: string) {
        super(source, information)
        if (error) this.error = error
        if (trace) this.trace = trace
    }
}

export class ClientInfo extends InfoModel {
    constructor(source: string, information: Info, message?: object) {
        super(source, information, message)
    }
}

export class Log {
    private static clientLogger: Logger = getLogger("client")
    private static events = ipcMain

    constructor(loggerName: loggerName = "client", config?: Configuration) {
        this.configureLog(config)
    }

    static info(info: ClientInfo) {
        try {
            Log.clientLogger.info(info.information, { source: info.source, ...info.message })
            Log.events.emit("log:onInfo", info)
        } catch (e: any) {
            throw e
        }
    }

    static error(info: ClientError) {
        try {
            Log.clientLogger.error(info.information, {
                source: info.source,
                error: info.error,
                stack: info.trace,
                ...info.message,
            })
            Log.events.emit("log:onError", info)
        } catch (e: any) {
            throw e
        }
    }

    static warn(info: ClientWarn) {
        try {
            Log.clientLogger.warn(info.information, { source: info.source, warn: info.warn, ...info.message })
            Log.events.emit("log:onWarn", info)
        } catch (e: any) {
            throw e
        }
    }

    /**
     * @description 具体参考log4js配置方法
     * @param conf
     */
    configureLog(conf?: Configuration) {
        try {
            if (conf) {
                ClientConfig.set(ConfigNames.log, conf)
            } else {
                conf = {
                    appenders: {
                        client: {
                            type: "file",
                            filename: app.getPath("appData") + "/logs/client.log",
                            maxLogSize: 50000, //文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
                        },
                    },
                    categories: { default: { appenders: ["client"], level: "info" } },
                }
                if (!ClientConfig.has(ConfigNames.log)) ClientConfig.set(ConfigNames.log, conf)
                configure(conf)
            }
        } catch (e: any) {
            throw e
        }
    }
}

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
