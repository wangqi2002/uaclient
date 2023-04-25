"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.Broker = exports.MessagePipe = void 0;
const ipc_handler_js_1 = require("./../../ipc/handlers/ipc.handler.js");

/**
 * @description 一个MessagePipe,本质上是一个map其中存储了形如<nodeId,[data1,data2]>的数据,并且定义了events用于订阅使用
 */
class MessagePipe {
    content;
    maxLength;
    pipeId;

    constructor(pipeId, maxLength) {
        this.pipeId = pipeId;
        this.content = new Map();
        this.maxLength = maxLength ? maxLength : 200;
    }

    changeMaxLength(length) {
        if (length > 0) {
            this.maxLength = length;
            return true;
        }
        return false;
    }

    async inPipe(id, message) {
        let data = this.content.get(id);
        if (data) {
            data.push(message);
            if (data.length >= this.maxLength) {
                // this.emit('full', data)
                ipc_handler_js_1.ipcClient.emitToRender('pipe:' + this.pipeId + '.full', data);
                ipc_handler_js_1.ipcClient.emitLocal('pipe:' + this.pipeId + '.full', data);
                data.length = 0;
            }
        } else {
            this.content.set(message.nodeId, [message]);
        }
        // this.emit('pushed', message)
        ipc_handler_js_1.ipcClient.emitToRender('pipe:' + this.pipeId + '.pushed', message);
        ipc_handler_js_1.ipcClient.emitLocal('pipe:' + this.pipeId + '.pushed', message);
    }

    terminate() {
        let copy = new Map(this.content);
        // this.emit('close', copy)
        ipc_handler_js_1.ipcClient.emitToRender('pipe:' + this.pipeId + '.close', copy);
        ipc_handler_js_1.ipcClient.emitLocal('pipe:' + this.pipeId + '.close', copy);
        this.content.clear();
        return copy;
    }
}

exports.MessagePipe = MessagePipe;

/**
 * @description 一个中间消息转发者,通过自主新建的MessagePipe来实现不同管道的订阅与通信
 */
class Broker {
    static pipes = new Map();

    /**
     * @description 接收消息并且推入pipe中,如果pipe不存在,那么新建一个pipe
     * @param pipeId
     * @param messageId
     * @param message
     * @example
     * Broker.receive(
     *   Config.defaultPipeName,
     *   messageId,
     *   new UaMessage(data, nodeId, item.displayName),
     *)
     */
    static async receive(pipeId, messageId, message) {
        let data = Broker.pipes.get(pipeId);
        if (!data) {
            let pipe = new MessagePipe(pipeId);
            Broker.pipes.set(pipeId, pipe);
            data = pipe;
        }
        data.inPipe(messageId, message);
        return true;
    }

    // static registerHandler(pipeId: pipeId,) {
    //     let data = Broker.pipes.get(pipeId)
    //     data?.on('pushed', () => {
    //         ipcClient.emit('pipeId:ua.pushed')
    //     })
    // }
    static hasPipe(pipeId) {
        return Broker.pipes.has(pipeId);
    }

    static getPipe(pipeId) {
        let pipe = Broker.pipes.get(pipeId);
        if (!pipe) {
            pipe = Broker.createPipe(pipeId);
        }
        return pipe;
    }

    /**
     * @description 创建一个MessagePipe
     * @param pipeId
     * @example
     * Broker.createPipe(Config.defaultPipeName)
     */
    static createPipe(pipeId) {
        let pipe = new MessagePipe(pipeId);
        Broker.pipes.set(pipeId, pipe);
        return pipe;
    }

    /**
     * @description 可以改变你所指定的MessagePipe中消息队列的长度,默认值为200
     * @param pipeId
     * @param length
     */
    static changePipeLength(pipeId, length) {
        let pipe = Broker.pipes.get(pipeId);
        if (pipe) {
            pipe.changeMaxLength(length);
        }
    }

    /**
     * @description 终结所有当前存在的messagePipe,注意:这会导致pipe中的数据丢失,但是会在消失之前通过close事件发送出去
     */
    async beforeClose() {
        Broker.pipes.forEach((pipe) => {
            pipe.terminate();
        });
    }
}

exports.Broker = Broker;
