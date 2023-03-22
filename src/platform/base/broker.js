"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }

    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.Broker = exports.MessagePipe = exports.MessageQueue = void 0;
const events_1 = require("events");
const config_default_1 = require("../../plugins/ua.client/config/config.default");
//todo 重写messageQueue模块以适应所有形式的消息
/**
 * @description Ua后台发过来的消息的队列,前端只需订阅pushed,
 * 数据库订阅full/close事件即可
 * 当full事件触发之后,会清空队列
 * @author hhj
 * @example
 * UaMessageQueue.queueEvents.on('pushed',(data)=>{
 *     handleData(data)
 * })
 * UaMessageQueue.queueEvents.on('full',(arrayOfMessages:any[])=>{
 *     eventHandle(arrayOfMessages)
 * })
 * UaMessageQueue.queueEvents.on('close', (data) => {
 *     eventHandle(data)
 * })
 */
var MessageQueue;
(function (MessageQueue) {
    let queue = new Map();
    let maxLength = config_default_1.Config.mqLength;
    let currentLength = 0;
    MessageQueue.queueEvents = new events_1.EventEmitter();

    function changeMaxLength(length) {
        if (length > 0)
            maxLength = length;
    }

    MessageQueue.changeMaxLength = changeMaxLength;

    /**
     * @description 将信息节点推入消息队列之中
     * @param message
     */
    function enqueue(message) {
        let data = queue.get(message.nodeId);
        if (data) {
            data.push(message);
            if (data.length >= maxLength) {
                MessageQueue.queueEvents.emit('full', data);
                data.length = 0;
            }
        } else {
            queue.set(message.nodeId, [message]);
        }
        MessageQueue.queueEvents.emit('pushed', message);
        currentLength++;
    }

    MessageQueue.enqueue = enqueue;

    function closeMq() {
        let lastQ = new Map(queue);
        MessageQueue.queueEvents.emit('close', lastQ);
        queue.clear();
        return lastQ;
    }

    MessageQueue.closeMq = closeMq;
})(MessageQueue = exports.MessageQueue || (exports.MessageQueue = {}));

class MessagePipe {
    constructor(maxLength) {
        this.content = new Map();
        this.events = new events_1.EventEmitter();
        this.maxLength = maxLength ? maxLength : 20;
    }

    changeMaxLength(length) {
        this.maxLength = length;
    }

    inPipe(id, message) {
        let data = this.content.get(id);
        if (data) {
            data.push(message);
            if (data.length >= this.maxLength) {
                this.events.emit('full', data);
                data.length = 0;
            }
        } else {
            this.content.set(message.nodeId, [message]);
        }
        this.events.emit('pushed', message);
    }

    terminate() {
        let copy = new Map(this.content);
        this.events.emit('close', copy);
        this.content.clear();
        return copy;
    }
}

exports.MessagePipe = MessagePipe;
var Broker;
(function (Broker) {
    let pipes = new Map();

    function receive(pipeId, messageId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = pipes.get(pipeId);
            if (!data) {
                pipes.set(pipeId, new MessagePipe());
                data = pipes.get(pipeId);
            }
            data.inPipe(messageId, message);
        });
    }

    Broker.receive = receive;

    function createPipe(pipeId) {
        pipes.set(pipeId, new MessagePipe());
    }

    Broker.createPipe = createPipe;

    function getPipeEvents(pipeId) {
        let pipe = pipes.get(pipeId);
        return pipe ? pipe.events : undefined;
    }

    Broker.getPipeEvents = getPipeEvents;

    function changePipeLength(pipeId, length) {
        let pipe = pipes.get(pipeId);
        if (pipe) {
            pipe.changeMaxLength(length);
        }
    }

    Broker.changePipeLength = changePipeLength;

    function terminateAll() {
        return __awaiter(this, void 0, void 0, function* () {
            pipes.forEach((pipe) => {
                pipe.terminate();
            });
        });
    }

    Broker.terminateAll = terminateAll;
})(Broker = exports.Broker || (exports.Broker = {}));
