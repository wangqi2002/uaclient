import {UaMessageQueue} from './mq'
import {SessionService} from '../server/services/session.service'
import {DbService} from '../server/services/db.service'

export module Operations {

    export async function initByConfig() {

    }

    export async function close() {
        UaMessageQueue.closeMq()
        await SessionService.closeSession(true)
        DbService.closeDb()
    }
}