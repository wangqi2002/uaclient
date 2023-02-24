import {EventEmitter} from 'events'
import {MessageModel} from '../server/models/message.model'
import {Config} from '../config/config.default'


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
    let queue: Map<string, MessageModel[]> = new Map()
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
    export function enqueue(message: MessageModel) {
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