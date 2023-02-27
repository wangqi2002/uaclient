import {Configuration, configure, getLogger, Logger} from 'log4js'
import {EventEmitter} from 'events'
import {JsonUtils} from '../server/utils/util'
import {ClientError, ClientInfo, ClientWarn} from '../server/models/infos.model'
import Path from 'path'

/**
 * @description 使用log4js库作为日志
 * 参照教程https://zhuanlan.zhihu.com/p/22110802,
 * 前端只需订阅info/error/warn事件即可
 * 如果需要配置log,使用Log.configureLog()方法,具体参考log4js配置方法
 * @example
 * const Log = require('log')
 * Log.info('nice')
 *
 * Log.logEvents.on('info',(info,params)=>{
 * })
 */
export module Log {
    let con = {
        appenders: {
            client: {
                type: 'file',
                filename: Path.join(__dirname, "..", "..", '/logs/client.log'),
                maxLogSize: 20000,//文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
            }
        },
        categories: {default: {appenders: ['client'], level: 'info'}}
    }
    configure(con)
    let log: Logger = getLogger('client')
    export let logEvents = new EventEmitter()

    export function info(info: ClientInfo) {
        log.info(info.information, {source: info.source, ...info.message})
        logEvents.emit('info', info)
    }

    export function error(info: ClientError) {
        log.error(info.information,
            {source: info.source, error: info.error, ...info.message})
        logEvents.emit('error', info)
    }

    export function warn(info: ClientWarn) {
        log.warn(info.information,
            {source: info.source, warn: info.warn, ...info.message})
        logEvents.emit('warn', info)
    }

    /**
     * @description 加载json文件中的log设置
     * @param fileName
     * @param nodeToLoad
     * @private
     */
    export function loadLogConfig(fileName: string, nodeToLoad: string[]) {
        let node = JsonUtils.getJsonNode(fileName, nodeToLoad)
        configure(node)
    }

    /**
     * @description 具体参考log4js配置方法
     * @param conf
     * @param filePath
     * @param nodeToModify
     */
    export function configureLog(conf: Configuration, filePath: string, nodeToModify: string[]) {
        const content = JSON.stringify({
            LogConfig: {...conf},
        })
        JsonUtils.modifyJsonNode(filePath, nodeToModify, content)
        configure(conf)
    }
}
