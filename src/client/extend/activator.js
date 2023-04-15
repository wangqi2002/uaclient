'use strict'
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value)
                  })
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value))
                } catch (e) {
                    reject(e)
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value))
                } catch (e) {
                    reject(e)
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next())
        })
    }
Object.defineProperty(exports, '__esModule', { value: true })
exports.ExtensionActivator = void 0
const worker_threads_1 = require('worker_threads')
const extend_1 = require('./extend')
class ExtensionActivator {
    constructor() {
        ExtensionActivator.extensionInstanceManagers = new Map()
    }
    static activate(extension) {
        ExtensionActivator.events.emit('activate', extension)
    }
    doActivateExtension(extension) {
        return __awaiter(this, void 0, void 0, function* () {
            let { activate, beforeClose, actualEntrance } = require(extension.storage)
            try {
                yield activate()
                extend_1.ExtensionManager.registerCloseFunction(beforeClose)
                ExtensionActivator.extensionInstanceManagers.set(extension.identifier.id, {
                    identifier: extension.identifier,
                    worker: new worker_threads_1.Worker(actualEntrance),
                    instance: {
                        activate: activate,
                        beforeClose: beforeClose,
                        actualEntrance: actualEntrance,
                    },
                })
            } catch (e) {
                throw e
            }
        })
    }
    static terminateExtensionInstance(extensionId) {
        let instance = ExtensionActivator.extensionInstanceManagers.get(extensionId)
        try {
            if (instance) {
                instance.instance.beforeClose()
                instance.worker.terminate()
            }
        } catch (e) {
            throw e
        }
    }
    static beforeClose() {
        ExtensionActivator.extensionInstanceManagers.forEach((instance, extensionId) => {
            ExtensionActivator.terminateExtensionInstance(extensionId)
        })
    }
}
// exports.ExtensionActivator = ExtensionActivator;
// const activator = new ExtensionActivator();
// ExtensionActivator.events.on('activate', (extension) => {
//     activator.doActivateExtension(extension);
// });
