"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.Log = exports.ClientInfo = exports.ClientError = exports.ClientWarn = exports.InfoModel = void 0;
const log4js_1 = require("log4js");
const util_1 = require("../../plugins/ua.client/ua.servant/utils/util");
const path_1 = __importDefault(require("path"));
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
var Log;
(function (Log) {
    let con = {
        appenders: {
            client: {
                type: 'file',
                filename: path_1.default.join(__dirname, "..", "..", '/logs/client.log'),
                maxLogSize: 50000, //文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
            }
        },
        categories: {default: {appenders: ['client'], level: 'info'}}
    };
    (0, log4js_1.configure)(con);
    let log = (0, log4js_1.getLogger)('client');
    function info(info) {
        try {
            log.info(info.information, Object.assign({source: info.source}, info.message));
        } catch (e) {
            throw e;
        }
    }
    Log.info = info;
    function error(info) {
        try {
            log.error(info.information, Object.assign({
                source: info.source,
                error: info.error,
                stack: info.trace
            }, info.message));
        } catch (e) {
            throw e;
        }
    }
    Log.error = error;
    function warn(info) {
        try {
            log.warn(info.information, Object.assign({source: info.source, warn: info.warn}, info.message));
        } catch (e) {
            throw e;
        }
    }
    Log.warn = warn;
    /**
     * @description 加载json文件中的log设置
     * @param fileName
     * @param nodeToLoad
     * @private
     */
    function loadLogConfig(fileName, nodeToLoad) {
        let node = util_1.JsonUtils.getJsonNode(fileName, nodeToLoad);
        (0, log4js_1.configure)(node);
    }
    Log.loadLogConfig = loadLogConfig;
    /**
     * @description 具体参考log4js配置方法
     * @param conf
     * @param filePath
     * @param nodeToModify
     */
    function configureLog(conf, filePath, nodeToModify) {
        const content = JSON.stringify({
            LogConfig: Object.assign({}, conf),
        });
        util_1.JsonUtils.modifyJsonNode(filePath, nodeToModify, content);
        (0, log4js_1.configure)(conf);
    }
    Log.configureLog = configureLog;
})(Log = exports.Log || (exports.Log = {}));
