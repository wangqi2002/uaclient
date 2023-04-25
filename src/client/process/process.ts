import child_process, { ChildProcess } from 'child_process'
import EventEmitter from 'events'
import { moduleName } from '../enums.js'

export class ProcessManager {
    static events: EventEmitter
    static processes: Map<moduleName, ChildProcess>

    constructor() {
        ProcessManager.processes = new Map()
    }
    /**
     * @description 创建一个子线程,指定path和moduleName,其中moduleName应当是一个工作的子进程所属模块
     * @param path
     * @param module
     * @param options
     */
    static createChildProcess(path: string, module: moduleName, options?: child_process.ForkOptions) {
        let child = child_process.fork(path, options)
        if (child.pid) {
            ProcessManager.processes.set(module, child)
        }
    }

    static killProcess(module: moduleName) {
        let child = ProcessManager.processes.get(module)
        if (child) {
            child.kill()
        }
    }

    beforeClose() {
        ProcessManager.processes.forEach((process, module) => {
            process.kill()
            ProcessManager.events.emit('process-killed', module)
        })
    }
}
