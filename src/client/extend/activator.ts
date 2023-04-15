import { Worker } from 'worker_threads'
import { IMainExtension } from './extend'

type workerId = string
export class ExtensionActivator {
    static runningWorkers: Map<workerId, Worker>

    constructor() {}
    //通过vm2沙箱执行插件文件
    static async activateExtension(extension: IMainExtension) {
        ExtensionActivator.runningWorkers.set(
            extension.identifier.id,
            new Worker('./src/client/run.js', { workerData: extension.storage })
        )
    }

    static activateThis(start: () => void, beforeClose: () => void) {
        new Worker(__dirname)
    }

    static runFile(path: string) {}

    killWorker(workerId: string) {
        let worker = ExtensionActivator.runningWorkers.get(workerId)
        ExtensionActivator.runningWorkers.delete(workerId)
        worker?.terminate()
    }

    beforeClose() {
        ExtensionActivator.runningWorkers.forEach((value: Worker, workerId: string) => {
            this.killWorker(workerId)
        })
    }
}
