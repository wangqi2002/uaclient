import EventEmitter from 'events'
import { Worker } from 'worker_threads'
import { ExtensionManager, IExtensionIdentifier, IExtension } from './extend'

type extensionId = string

/**
 * @description activate是插件激活时执行的函数,
 * beforeClose会在结束插件结束之前执行,
 * 而workerEntrance提供一个需要做cpu密集型工作的js模块的绝对路径
 */
export interface IExtensionInstance {
    activate: () => void
    beforeClose: () => void
    workerEntrance: string | undefined | null
}

export interface IExtensionInstanceManager {
    identifier: IExtensionIdentifier
    worker: Worker | undefined | null
    instance: IExtensionInstance
}

export class ExtensionActivator {
    static events: EventEmitter
    static extensionInstanceManagers: Map<extensionId, IExtensionInstanceManager>

    constructor() {
        ExtensionActivator.events = new EventEmitter()
        ExtensionActivator.extensionInstanceManagers = new Map()
    }

    static activate(extension: IExtension) {
        ExtensionActivator.events.emit('activate', extension)
    }

    /**
     * @description 每个插件的入口文件extension.js必须导出一个instance对象实现extensionInstance接口
     * @param IExtension
     */
    async doActivateExtension(IExtension: IExtension) {
        try {
            let { extension } = await import(IExtension.storage)
            await extension.activate()
            let worker = undefined
            if (extension.workerEntrance) {
                worker = new Worker(extension.workerEntrance)
            }
            ExtensionActivator.extensionInstanceManagers.set(IExtension.identifier.id, {
                identifier: IExtension.identifier,
                worker: worker,
                instance: {
                    activate: extension.activate,
                    beforeClose: extension.beforeClose,
                    workerEntrance: extension.workerEntrance,
                },
            })
        } catch (e: any) {
            throw e
        }
    }

    static terminateExtensionInstance(extensionId: string) {
        let instance = ExtensionActivator.extensionInstanceManagers.get(extensionId)
        try {
            if (instance) {
                instance.instance.beforeClose()
                if (instance.worker) instance.worker.terminate()
            }
        } catch (e: any) {
            throw e
        }
    }

    static beforeClose() {
        ExtensionActivator.extensionInstanceManagers.forEach(
            (instance: IExtensionInstanceManager, extensionId: string) => {
                ExtensionActivator.terminateExtensionInstance(extensionId)
            }
        )
    }
}

const activator = new ExtensionActivator()
ExtensionActivator.events.on('activate', (extension: IExtension) => {
    activator.doActivateExtension(extension)
})
