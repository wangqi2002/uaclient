import {EventEmitter} from 'events'
import {MessageModel} from '../server/models/message.model'


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
    let maxLength: number = 200
    let currentLength = 0
    export let queueEvents: EventEmitter = new EventEmitter()

    export function changeMaxLength(length: number) {
        maxLength = length
    }

    /**
     * @description 将信息节点推入消息队列之中
     * @param message
     */
    export function enqueue(message: MessageModel) {
        if (queue.has(message.nodeId)) {
            let data = queue.get(message.nodeId)
            data
                ? data.push(message)
                : data = [];
            data.push(message)
        } else {
            queue.set(message.nodeId, [message])
        }
        queueEvents.emit('pushed', message)
        currentLength++
        if (currentLength >= maxLength) {
            queueEvents.emit('full', new Map(queue))
            queue.clear()
        }
    }

    export function closeMq() {
        let lastQ = new Map(queue)
        queueEvents.emit('close', lastQ)
        queue.clear()
        return lastQ
    }
}


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
// export module MessageQueue {
//     let queue: DbData[] = []
//     let maxLength: number = 200
//     export let queueEvents: EventEmitter = new EventEmitter()
//
//     export function changeMaxLength(length: number) {
//         maxLength = length
//     }
//
//     /**
//      * @description 将信息节点推入消息队列之中
//      * @param message
//      * @param displayName
//      */
//     export async function enqueue(message: MessageModel, displayName: string) {
//         // let message=new MessageModel(data,node.nodeId.toString())
//         queueEvents.emit('pushed', message)
//         queue.push(new DbData(message, displayName))
//         if (queue.length >= maxLength) {
//             queueEvents.emit('full', queue.slice(0))
//             queue.length = 0
//             queueEvents.emit('cleared')
//         }
//     }
//
//     export function closeMq() {
//         queueEvents.emit('full', queue.slice(0))
//         queue.length = 0
//     }
// }
