import {LogModel} from '../server/models/log.model'
import {Errors, Infos, Sources, Warns} from './enums'

export class ClientWarn extends LogModel {

    constructor(source: Sources, information: Warns, message?: object) {
        super(source, information, message)
    }
}

export class ClientError extends LogModel {
    error?: string

    constructor(source: Sources, information: Errors, error?: string, message?: object,) {
        super(source, information, message)
        if (error) this.error = error
    }
}

export class ClientInfo extends LogModel {

    constructor(source: Sources, information: Infos, message?: object) {
        super(source, information, message)
    }
}