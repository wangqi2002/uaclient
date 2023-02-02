import {MessageModel} from './message.model'
import {ClientService} from '../services/client.service'


export interface IFieldNames {
    serverF: string
    nodeIdF: string
    displayNameF: string
    statusCodeF: string
    sourceTimeStampF: string
    serverTimeStampF: string
    valueF: string
    dataTypeF: string
}

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

    constructor(message: MessageModel, name: string, server?: string) {
        super(message)
        this.displayName = name
        this.server = ClientService.currentServer
        if (server) this.server = server
        this.value = message.value.toString()
    }
}

export interface IDbParam {
    values: IDbData,
    tableName?: string,
    /**
     * @default {
     *     serverF:'Server',
     *     nodeIdF:'NodeId',
     *     displayNameF:'DisplayName',
     *     serverTimeStampF:'ServerTimeStamp',
     *     sourceTimeStampF:'SourceTimeStamp',
     *     statusCodeF:'StatusCode',
     *     dataTypeF:'DataType',
     *     valueF:'Value'
     * }
     */
    fieldNames?: IFieldNames
}
