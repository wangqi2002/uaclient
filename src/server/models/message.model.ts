import {DataType, DataValue} from 'node-opcua'

export class MessageModel {
    nodeId:string
    statusCode:string
    sourceTimeStamp:string
    serverTimeStamp:string
    value:any
    dataType:string

    constructor(message:MessageModel)
    constructor(dataValue:DataValue,nodeId:string)
    constructor(param:any,nodeId?:string) {
        if (nodeId){
            this.nodeId=nodeId.toString()
            this.statusCode=param.statusCode.name.toString()
            this.serverTimeStamp=param.serverTimestamp.toLocaleString()
            this.sourceTimeStamp=param.sourceTimestamp.toLocaleString()
            this.value=param.value.value
            this.dataType=DataType[param.value.dataType].toString()
        }else {
            this.nodeId=param.nodeId
            this.statusCode=param.statusCode
            this.value=param.value.toString()
            this.dataType=param.dataType
            this.sourceTimeStamp=param.sourceTimestamp
            this.serverTimeStamp=param.serverTimestamp
        }
    }
}