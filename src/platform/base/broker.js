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
exports.Broker = exports.MessagePipe = void 0;
const events_1 = require("events");
/**
 * @description 一个MessagePipe,本质上是一个map其中存储了形如<nodeId,[data1,data2]>的数据,并且定义了events用于订阅使用
 */
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
/**
 * @description 一个中间消息转发者,通过自主新建的MessagePipe来实现不同管道的订阅与通信
 */
var Broker;
(function (Broker) {
    let pipes = new Map();
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
    /**
     * @description 创建一个MessagePipe
     * @param pipeId
     * @example
     * Broker.createPipe(Config.defaultPipeName)
     */
    function createPipe(pipeId) {
        pipes.set(pipeId, new MessagePipe());
    }
    Broker.createPipe = createPipe;
    /**
     * @description 得到你订阅的管道的event,并且利用它进行功能开发
     * @param pipeId
     * @example
     * let events = Broker.getPipeEvents(Config.defaultPipeName)
     * events?.on('full', (data) => {
     *    DbService.insertMany(data)
     * })
     */
    function getPipeEvents(pipeId) {
        let pipe = pipes.get(pipeId);
        return pipe ? pipe.events : undefined;
    }
    Broker.getPipeEvents = getPipeEvents;
    /**
     * @description 可以改变你所指定的MessagePipe中消息队列的长度,默认值为200
     * @param pipeId
     * @param length
     */
    function changePipeLength(pipeId, length) {
        let pipe = pipes.get(pipeId);
        if (pipe) {
            pipe.changeMaxLength(length);
        }
    }
    Broker.changePipeLength = changePipeLength;
    /**
     * @description 终结所有当前存在的messagePipe,注意:这会导致pipe中的数据丢失,但是会在消失之前通过close事件发送出去
     */
    function terminateAll() {
        return __awaiter(this, void 0, void 0, function* () {
            pipes.forEach((pipe) => {
                pipe.terminate();
            });
        });
    }
    Broker.terminateAll = terminateAll;
})(Broker = exports.Broker || (exports.Broker = {}));
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
// export module MessageQueue {
//     let queue: Map<string, UaMessage[]> = new Map()
//     let maxLength: number = Config.mqLength as number
//     let currentLength = 0
//     export let queueEvents: EventEmitter = new EventEmitter()
//
//     export function changeMaxLength(length: number) {
//         if (length > 0) maxLength = length
//     }
//
//     /**
//      * @description 将信息节点推入消息队列之中
//      * @param message
//      */
//     export function enqueue(message: UaMessage) {
//         let data = queue.get(message.nodeId)
//         if (data) {
//             data.push(message)
//             if (data.length >= maxLength) {
//                 queueEvents.emit('full', data)
//                 data.length = 0
//             }
//         } else {
//             queue.set(message.nodeId, [message])
//         }
//         queueEvents.emit('pushed', message)
//         currentLength++
//     }
//
//     export function closeMq() {
//         let lastQ = new Map(queue)
//         queueEvents.emit('close', lastQ)
//         queue.clear()
//         return lastQ
//     }
// }
