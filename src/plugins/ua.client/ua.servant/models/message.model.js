"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.UaMessage = void 0;
const node_opcua_1 = require("node-opcua");
const client_service_1 = require("../services/client.service");

/**
 * @description 定义订阅传递信息并且存入数据库的数据结构
 */
class UaMessage {
    server;
    nodeId;
    displayName;
    statusCode;
    sourceTimestamp;
    serverTimestamp;
    value;
    dataType;

    constructor(dataValue, nodeId, displayName) {
        this.server = client_service_1.ClientService.currentServer;
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
        this.dataType = node_opcua_1.DataType[dataValue.value.dataType].toString();
    }
}

exports.UaMessage = UaMessage;
