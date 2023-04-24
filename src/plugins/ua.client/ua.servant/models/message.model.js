import { DataType } from 'node-opcua';
import { ClientService } from '../services/client.service';
/**
 * @description 定义订阅传递信息并且存入数据库的数据结构
 */
export class UaMessage {
    server;
    nodeId;
    displayName;
    statusCode;
    sourceTimestamp;
    serverTimestamp;
    value;
    dataType;
    constructor(dataValue, nodeId, displayName) {
        this.server = ClientService.currentServer;
        this.displayName = displayName;
        this.nodeId = nodeId.toString();
        this.statusCode = dataValue.statusCode.name.toString();
        this.serverTimestamp = dataValue.serverTimestamp
            ? dataValue.serverTimestamp.toLocaleString()
            : new Date().toLocaleDateString();
        this.sourceTimestamp = dataValue.sourceTimestamp
            ? dataValue.sourceTimestamp.toLocaleString()
            : new Date().toLocaleDateString();
        this.value = dataValue.value.value.toString();
        this.dataType = DataType[dataValue.value.dataType].toString();
    }
}
