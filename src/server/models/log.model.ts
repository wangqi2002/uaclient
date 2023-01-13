import {SourceModules} from '../../common/enums'

export class LogModel {
    timeStamp: string
    source: SourceModules
    information: string
    server?: string
    message?: object

    constructor(source: SourceModules, information: string, server?: string, message?: object) {
        this.timeStamp = new Date().toLocaleString()
        this.source = source
        this.server = server
        this.information = information
        this.message = message
    }
}