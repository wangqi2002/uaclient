import {EventEmitter} from 'events'
import {UaMessage} from '../../plugins/ua.client/ua.servant/models/message.model'
import {Config} from '../../plugins/ua.client/config/config.default'

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
export module MessageQueue {
    let queue: Map<string, UaMessage[]> = new Map()
    let maxLength: number = Config.mqLength as number
    let currentLength = 0
    export let queueEvents: EventEmitter = new EventEmitter()

    export function changeMaxLength(length: number) {
        if (length > 0) maxLength = length
    }

    /**
     * @description 将信息节点推入消息队列之中
     * @param message
     */
    export function enqueue(message: UaMessage) {
        let data = queue.get(message.nodeId)
        if (data) {
            data.push(message)
            if (data.length >= maxLength) {
                queueEvents.emit('full', data)
                data.length = 0
            }
        } else {
            queue.set(message.nodeId, [message])
        }
        queueEvents.emit('pushed', message)
        currentLength++
    }

    export function closeMq() {
        let lastQ = new Map(queue)
        queueEvents.emit('close', lastQ)
        queue.clear()
        return lastQ
    }
}

export class MessagePipe {
    content: Map<string, any[]>
    events: EventEmitter
    maxLength: number

    constructor(maxLength?: number) {
        this.content = new Map()
        this.events = new EventEmitter()
        this.maxLength = maxLength ? maxLength : 20
    }

    changeMaxLength(length: number) {
        this.maxLength = length
    }

    inPipe(id: string, message: any) {
        let data = this.content.get(id)
        if (data) {
            data.push(message)
            if (data.length >= this.maxLength) {
                this.events.emit('full', data)
                data.length = 0
            }
        } else {
            this.content.set(message.nodeId, [message])
        }
        this.events.emit('pushed', message)
    }

    terminate() {
        let copy = new Map(this.content)
        this.events.emit('close', copy)
        this.content.clear()
        return copy
    }
}

export module Broker {
    let pipes: Map<string, MessagePipe> = new Map<string, MessagePipe>()

    export async function receive(pipeId: string, messageId: string, message: any) {
        let data = pipes.get(pipeId)
        if (!data) {
            pipes.set(pipeId, new MessagePipe())
            data = pipes.get(pipeId) as MessagePipe
        }
        data.inPipe(messageId, message)
    }

    export function createPipe(pipeId: string,) {
        pipes.set(pipeId, new MessagePipe())
    }

    export function getPipeEvents(pipeId: string) {
        let pipe = pipes.get(pipeId)
        return pipe ? pipe.events : undefined
    }

    export function changePipeLength(pipeId: string, length: number) {
        let pipe = pipes.get(pipeId)
        if (pipe) {
            pipe.changeMaxLength(length)
        }
    }

    export async function terminateAll() {
        pipes.forEach((pipe) => {
            pipe.terminate()
        })
    }
}

