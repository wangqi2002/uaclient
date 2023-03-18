import {MessageQueue} from './broker'
import {SessionService} from '../plugins/ua.client/ua.server/services/opcua.services/session.service'
import {DbService} from '../plugins/ua.client/ua.server/services/opcua.services/db.service'
import {Log} from './log'
import {Configuration} from 'log4js'

//todo electron应用安装时执行create pki命令
export module Operations {
    /**
     * @description 安装时必须执行此函数==>创建PKI文件夹并使用certificate
     */
    export function createPKI() {
        let exec = require('child_process').exec
        exec('npx node-opcua-pki createPKI')
    }

    export async function initByConfig() {

    }

    export async function configureLog(conf: Configuration, filepath: string, nodeToModify: string[]) {
        Log.configureLog(conf, filepath, nodeToModify)
    }

    export function configureMQ(length: number) {
        MessageQueue.changeMaxLength(length)
    }

    export async function close() {
        MessageQueue.closeMq().forEach((messages) => {
            DbService.insertMany(messages)
        })
        await SessionService.closeSession(true)
        DbService.closeDb()
    }
}