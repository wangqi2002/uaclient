import { app } from 'electron';
import log from 'log4js';
const { configure, getLogger } = log;
import { MainEvents, rendererEvents } from '../../ipc/events/ipc.events.js';
import { ipcClient } from '../../ipc/handlers/ipc.handler.js';
import { ClientStore, ConfigNames } from '../../../client/store/store.js';
export class InfoModel {
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
export class ClientWarn extends InfoModel {
    warn;
    constructor(source, information, warn, message) {
        super(source, information, message);
        if (warn)
            this.warn = warn;
    }
}
export class ClientError extends InfoModel {
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
export class ClientInfo extends InfoModel {
    constructor(source, information, message) {
        super(source, information, message);
    }
}
export class Log {
    static clientLogger = getLogger('client');
    constructor(loggerName = 'client', config) {
        this.configureLog(config);
        this.initBind();
    }
    static info(info) {
        try {
            Log.clientLogger.info(info.information, { source: info.source, ...info.message });
            ipcClient.emit(MainEvents.logEmitEvents.info, info);
        }
        catch (e) {
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
            ipcClient.emit(MainEvents.logEmitEvents.error, info);
        }
        catch (e) {
            throw e;
        }
    }
    static warn(info) {
        try {
            Log.clientLogger.warn(info.information, { source: info.source, warn: info.warn, ...info.message });
            ipcClient.emit(MainEvents.logEmitEvents.warn, info);
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
                ClientStore.set('config', ConfigNames.log, conf);
            }
            else {
                conf = {
                    appenders: {
                        client: {
                            type: 'file',
                            filename: app.getPath('appData') + '/logs/client.log',
                            maxLogSize: 50000, //文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
                        },
                    },
                    categories: { default: { appenders: ['client'], level: 'info' } },
                };
                if (!ClientStore.has('config', ConfigNames.log))
                    ClientStore.set('config', ConfigNames.log, conf);
                configure(conf);
            }
        }
        catch (e) {
            throw e;
        }
    }
    initBind() {
        ipcClient.on(rendererEvents.logEvents.info, (event, args) => {
            Log.info(args);
        });
        ipcClient.on(rendererEvents.logEvents.error, (event, args) => {
            Log.error(args);
        });
        ipcClient.on(rendererEvents.logEvents.warn, (event, args) => {
            Log.warn(args);
        });
    }
}
//todo 安装时,应当初始化log和database服务
