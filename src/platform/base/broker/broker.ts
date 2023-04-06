import { EventEmitter } from "events"
type pipeId = string

/**
 * @description 一个MessagePipe,本质上是一个map其中存储了形如<nodeId,[data1,data2]>的数据,并且定义了events用于订阅使用
 */
export class MessagePipe extends EventEmitter {
    content: Map<string, any[]>
    maxLength: number

    constructor(maxLength?: number) {
        super()
        this.content = new Map()
        this.maxLength = maxLength ? maxLength : 200
    }

    changeMaxLength(length: number): boolean {
        if (length > 0) {
            this.maxLength = length
            return true
        }
        return false
    }

    async inPipe(id: string, message: any) {
        let data = this.content.get(id)
        if (data) {
            data.push(message)
            if (data.length >= this.maxLength) {
                this.emit("full", data)
                data.length = 0
            }
        } else {
            this.content.set(message.nodeId, [message])
        }
        this.emit("pushed", message)
    }

    terminate() {
        let copy = new Map(this.content)
        this.emit("close", copy)
        this.content.clear()
        return copy
    }
}

/**
 * @description 一个中间消息转发者,通过自主新建的MessagePipe来实现不同管道的订阅与通信
 */
export class Broker {
    private static pipes: Map<pipeId, MessagePipe>

    constructor() {
        Broker.pipes = new Map<pipeId, MessagePipe>()
    }

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
    static async receive(pipeId: pipeId, messageId: string, message: any) {
        let data = Broker.pipes.get(pipeId)
        if (!data) {
            let pipe = new MessagePipe()
            Broker.pipes.set(pipeId, pipe)
            data = pipe
        }
        data.inPipe(messageId, message)
        return true
    }

    static hasPipe(pipeId: string): boolean {
        return Broker.pipes.has(pipeId)
    }

    static async getPipe(pipeId: string) {
        return Broker.pipes.get(pipeId)
    }

    /**
     * @description 创建一个MessagePipe
     * @param pipeId
     * @example
     * Broker.createPipe(Config.defaultPipeName)
     */
    static createPipe(pipeId: string) {
        let pipe = new MessagePipe()
        Broker.pipes.set(pipeId, pipe)
        return pipe
    }

    /**
     * @description 可以改变你所指定的MessagePipe中消息队列的长度,默认值为200
     * @param pipeId
     * @param length
     */
    static changePipeLength(pipeId: pipeId, length: number) {
        let pipe = Broker.pipes.get(pipeId)
        if (pipe) {
            pipe.changeMaxLength(length)
        }
    }

    /**
     * @description 终结所有当前存在的messagePipe,注意:这会导致pipe中的数据丢失,但是会在消失之前通过close事件发送出去
     */
    async onClose() {
        Broker.pipes.forEach((pipe) => {
            pipe.terminate()
        })
    }
}
