import {Sources} from '../../common/enums'

export class LogModel {
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