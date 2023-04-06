import { app } from "electron"
import { Configuration, configure, getLogger, Logger } from "log4js"
import { MainEvents } from "../../ipc/events/ipc.events"
import { EventBind, mainEmit } from "../../ipc/handlers/ipc.handler"
import { ClientStore, ConfigNames } from "../store/store"

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

    constructor(loggerName: loggerName = "client", config?: Configuration) {
        this.configureLog(config)
        EventBind.logInitBind()
    }

    static info(info: ClientInfo) {
        try {
            Log.clientLogger.info(info.information, { source: info.source, ...info.message })
            mainEmit.emit(MainEvents.logEmitEvents.info, info)
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
            mainEmit.emit(MainEvents.logEmitEvents.error, info)
        } catch (e: any) {
            throw e
        }
    }

    static warn(info: ClientWarn) {
        try {
            Log.clientLogger.warn(info.information, { source: info.source, warn: info.warn, ...info.message })
            mainEmit.emit(MainEvents.logEmitEvents.warn, info)
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
                ClientStore.set("config", ConfigNames.log, conf)
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
                if (!ClientStore.has("config", ConfigNames.log)) ClientStore.set("config", ConfigNames.log, conf)
                configure(conf)
            }
        } catch (e: any) {
            throw e
        }
    }
}
//todo 安装时,应当初始化log和database服务
//todo 添加socket服务以供更多程序使用
