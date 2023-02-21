import {MessageQueue} from './mq'
import {SessionService} from '../server/services/session.service'
import {DbService} from '../server/services/db.service'
import {Log} from './log'
import {Configuration} from 'log4js'

export module Operations {

    export async function initByConfig() {

    }

    export async function configureLog(conf: Configuration, filepath: string, nodeToModify: string[]) {
        Log.configureLog(conf, filepath, nodeToModify)
    }

    export function configureMQ(length: number) {
        MessageQueue.changeMaxLength(length)
    }

    export async function close() {
        MessageQueue.closeMq()
        await SessionService.closeSession(true)
        DbService.closeDb()
    }
}