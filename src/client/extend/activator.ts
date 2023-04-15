import EventEmitter from 'events'
import { Worker } from 'worker_threads'
import { ExtensionManager, IExtensionIdentifier, IMainExtension } from './extend'

type extensionId = string

export interface extensionInstance {
    activate: () => void
    beforeClose: () => boolean
    actualEntrance: string
}

export interface extensionInstanceManager {
    identifier: IExtensionIdentifier
    worker: Worker
    instance: extensionInstance
}

export class ExtensionActivator {
    static events: EventEmitter
    static extensionInstanceManagers: Map<extensionId, extensionInstanceManager>

    constructor() {
        ExtensionActivator.extensionInstanceManagers = new Map()
    }

    static activate(extension: IMainExtension) {
        ExtensionActivator.events.emit('activate', extension)
    }

    async doActivateExtension(extension: IMainExtension) {
        let { activate, beforeClose, actualEntrance } = require(extension.storage)
        try {
            await activate()
            ExtensionManager.registerCloseFunction(beforeClose)
            ExtensionActivator.extensionInstanceManagers.set(extension.identifier.id, {
                identifier: extension.identifier,
                worker: new Worker(actualEntrance),
                instance: {
                    activate: activate,
                    beforeClose: beforeClose,
                    actualEntrance: actualEntrance,
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
                instance.worker.terminate()
            }
        } catch (e: any) {
            throw e
        }
    }

    static beforeClose() {
        ExtensionActivator.extensionInstanceManagers.forEach(
            (instance: extensionInstanceManager, extensionId: string) => {
                ExtensionActivator.terminateExtensionInstance(extensionId)
            }
        )
    }
}

const activator = new ExtensionActivator()
ExtensionActivator.events.on('activate', (extension: IMainExtension) => {
    activator.doActivateExtension(extension)
})
