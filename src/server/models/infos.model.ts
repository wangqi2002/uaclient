import {Errors, Infos, Sources, Warns} from '../../common/enums'

export class InfosModel {
    timeStamp: string
    source: Sources
    information: string
    server?: string
    message?: object

    constructor(source: Sources, information: string, message?: object, server?: string) {
        this.timeStamp = new Date().toLocaleString()
        this.source = source
        this.server = server
        this.information = information
        this.message = message
    }
}

export class ClientWarn extends InfosModel {
    warn?: string

    constructor(source: Sources, information: Warns, warn?: string, message?: object) {
        super(source, information, message)
        if (warn) this.warn = warn
    }
}

export class ClientError extends InfosModel {
    error?: string

    constructor(source: Sources, information: Errors, error?: string, message?: object,) {
        super(source, information, message)
        if (error) this.error = error
    }
}

export class ClientInfo extends InfosModel {

    constructor(source: Sources, information: Infos, message?: object) {
        super(source, information, message)
    }
}