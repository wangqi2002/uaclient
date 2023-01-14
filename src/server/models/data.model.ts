import {MessageModel} from './message.model'
import {ClientService} from '../services/client.service'

export class DbData extends MessageModel{
    server:string
    displayName:string

    constructor(message:MessageModel,name:string) {
        super(message)
        this.displayName=name
        this.server=ClientService.getServerName()
        this.value=message.value.toString()
    }
}