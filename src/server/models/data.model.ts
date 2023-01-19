import {MessageModel} from './message.model'
import {ClientService} from '../services/client.service'

export interface IDbData {
    server: string
    nodeId: string
    displayName: string
    value: string
    dataType: string
    sourceTimeStamp: string
    serverTimeStamp: string
    statusCode: string
}

export class DbData extends MessageModel implements IDbData {
    server: string
    displayName: string

    constructor(message: MessageModel, name: string) {
        super(message)
        this.displayName = name
        this.server = ClientService.getServerName()
        this.value = message.value.toString()
    }
}
