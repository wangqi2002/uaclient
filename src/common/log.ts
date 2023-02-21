import {Configuration, configure, getLogger, Logger} from 'log4js'
import {EventEmitter} from 'events'
import {getJsonNode, modifyJsonNode} from '../server/utils/util'
import {ClientError, ClientInfo, ClientWarn} from '../server/models/infos.model'

/**
 * @description 使用log4js库作为日志
 * 参照教程https://zhuanlan.zhihu.com/p/22110802,
 * 前端只需订阅info/error/warn事件即可
 * 如果需要配置log,使用Log.configureLog()方法,具体参考log4js配置方法
 * @example
 * const Log = require('log')
 * Log.info('nice')
 *
 * Log.logEvents.on('info',(message,params)=>{
 * })
 */
export module Log {
    let log: Logger = getLogger('client')
    export let logEvents = new EventEmitter()

    export function info(message: ClientInfo) {
        log.info(message.information, {server: message.server, source: message.source, ...message.message})
        logEvents.emit('info', message)
    }

    export function error(message: ClientError) {
        log.error(message.information,
            {server: message.server, source: message.source, error: message.error, ...message.message})
        logEvents.emit('error', message)
    }

    export function warn(message: ClientWarn) {
        log.warn(message.information,
            {server: message.server, source: message.source, warn: message.warn, ...message.message})
        logEvents.emit('warn', message)
    }

    /**
     * @description 加载json文件中的log设置
     * @param filePath
     * @param nodeToLoad
     * @private
     */
    export function loadLogConfig(filePath: string, nodeToLoad: string[]) {
        let node = getJsonNode(filePath, nodeToLoad)
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
        modifyJsonNode(filePath, nodeToModify, content)
        configure(conf)
    }
}
