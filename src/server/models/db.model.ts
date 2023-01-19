import {IDbData} from './data.model'


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
