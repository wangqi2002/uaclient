import EventEmitter from 'events';
// import { Worker } from 'worker_threads'
import { fork } from 'child_process';
export class ExtensionActivator {
    static events;
    static extensionInstanceManagers;
    constructor() {
        ExtensionActivator.events = new EventEmitter();
        ExtensionActivator.extensionInstanceManagers = new Map();
    }
    static activate(extension) {
        ExtensionActivator.events.emit('activate', extension);
    }
    /**
     * @description 每个插件的入口文件extension.js必须导出一个instance对象实现extensionInstance接口
     * @param IExtension
     */
    async doActivateExtension(IExtension) {
        try {
            let { extension } = await import(IExtension.storage);
            await extension.activate();
            let worker = undefined;
            if (extension.workerEntrance) {
                // worker = new Worker(extension.workerEntrance)
                fork(extension.workerEntrance);
                // cluster.fork(extension.workerEntrance)
                // await require(extension.workerEntrance)
            }
            ExtensionActivator.extensionInstanceManagers.set(IExtension.identifier.id, {
                identifier: IExtension.identifier,
                worker: worker,
                instance: {
                    activate: extension.activate,
                    beforeClose: extension.beforeClose,
                    workerEntrance: extension.workerEntrance,
                },
            });
        }
        catch (e) {
            throw e;
        }
    }
    static terminateExtensionInstance(extensionId) {
        let instance = ExtensionActivator.extensionInstanceManagers.get(extensionId);
        try {
            if (instance) {
                instance.instance.beforeClose();
                if (instance.worker)
                    instance.worker.terminate();
            }
        }
        catch (e) {
            throw e;
        }
    }
    static beforeClose() {
        ExtensionActivator.extensionInstanceManagers.forEach((instance, extensionId) => {
            ExtensionActivator.terminateExtensionInstance(extensionId);
        });
    }
}
const activator = new ExtensionActivator();
ExtensionActivator.events.on('activate', (extension) => {
    activator.doActivateExtension(extension);
});
