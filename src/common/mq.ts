import {EventEmitter} from 'events'
import {MessageModel} from '../server/models/message.model'
import {DbData} from '../server/models/data.model'

/**
 * @description Ua后台发过来的消息的队列,前端只需订阅pushed,
 * 数据库订阅full/cleared事件即可
 * 当full事件触发之后,会清空队列
 * @author hhj
 * @example
 * UaMessageQueue.queueEvents.on('pushed',(data)=>{
 *     handleData(data)
 * })
 * UaMessageQueue.queueEvents.on('full',(arrayOfMessages:any[])=>{
 *     eventHandle(arrayOfMessages)
 * })
 * UaMessageQueue.queueEvents.on('cleared', () => {
 *     eventHandle()
 * })
 */
export module UaMessageQueue {
    let queue: DbData[] = []
    let maxLength: number = 200
    export let queueEvents: EventEmitter = new EventEmitter()

    export function changeMaxLength(length: number) {
        maxLength = length
    }

    /**
     * @description 将信息节点推入消息队列之中
     * @param message
     * @param displayName
     */
    export async function enqueue(message: MessageModel, displayName: string) {
        // let message=new MessageModel(data,node.nodeId.toString())
        queueEvents.emit('pushed', message)
        queue.push(new DbData(message, displayName))
        if (queue.length >= maxLength) {
            queueEvents.emit('full', queue.slice(0))
            queue.length = 0
            queueEvents.emit('cleared')
        }
    }

    export function closeMq() {
        queueEvents.emit('full', queue.slice(0))
        queue.length = 0
    }
}