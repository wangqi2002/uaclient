import { ClientStore } from "./../../../client/store"
import { existsSync } from "fs"
import { ClientWarn } from "../log/log"
import { MainHandler } from "../../ipc/handlers/ipc.handler"
import child_process from "child_process"
//todo 修改以使用child_process执行插件
import Store from "electron-store"
import { app, ipcMain } from "electron"
import { type } from "os"

type extensionStorage = string
type extensionActivateEvent = string
type extensionId = string
type workspace = string | "global"

// const extensionStore = new Store({
//     name: "config",
//     fileExtension: "json",
//     cwd: app.getPath("userData"),
//     clearInvalidConfig: true,
// })
export interface IExtensionIdentifier {
    id: string
    uuid: string | null
}
export interface IMainExtension {
    identifier: IExtensionIdentifier
    isJsExtension: boolean
    onEvents: extensionActivateEvent[]
    storage: extensionStorage
    version: string
    engine: string
}

export interface IExtensionManager {
    attributes: {
        workSpace: workspace
        storagePath: string
    }
    enabledExtensions: IMainExtension[]
    disabledExtensions: IMainExtension[]
}
export interface IExtensionMannagers {
    extensionManagers: IExtensionManager[]
}

export class ExtensionMannagers implements IExtensionMannagers {
    extensionManagers: IExtensionManager[]
    constructor() {
        this.extensionManagers = []
    }
}
export class ExtensionManager {
    workspace: workspace
    // enabledExtensions: Map<extensionId, IMainExtension>
    extensionManagers: Map<workspace, IExtensionManager>
    extensionStore = "extensions"

    constructor() {
        this.workspace = "global"
        // this.enabledExtensions = new Map()
        this.extensionManagers = new Map()
        ClientStore.create({
            name: this.extensionStore,
            fileExtension: "json",
            cwd: app.getPath("appData"),
            clearInvalidConfig: true,
        })
        this.loadMannagers()
        this.loadExtensions()
    }

    loadMannagers() {
        let mannagers: IExtensionMannagers = ClientStore.get(this.extensionStore, "extensionMannagers")
        // let mannagers: IExtensionMannagers = require("./extension.json")
        mannagers.extensionManagers.forEach((extensionManager) => {
            this.extensionManagers.set(extensionManager.attributes.workSpace, extensionManager)
        })
    }

    async loadExtensions() {
        let mannager = this.extensionManagers.get(this.workspace)
        if (mannager) {
            let path = mannager.attributes.storagePath
            let change = false
            mannager.enabledExtensions.forEach((extension: IMainExtension, index: number) => {
                if (this.verifyStoragePath(path + extension.storage)) {
                    // this.enabledExtensions.set(extension.identifier.id, extension)
                    extension.onEvents.forEach((event) => {
                        ipcMain.once(event, () => {
                            this.activateExtension(extension)
                        })
                    })
                } else {
                    delete mannager?.enabledExtensions[index]
                    change = true
                }
            })
            if (change) {
                ClientStore.set(this.extensionStore, "enabledExtensions", mannager.enabledExtensions)
            }
        } else {
            console.log("不存在这个workspace")
        }
    }

    verifyStoragePath(path: string) {
        if (existsSync(path)) {
            return true
        } else {
            return false
        }
    }

    async activateExtension(extension: IMainExtension) {
        child_process.fork(extension.storage)
    }

    enableExtention(workspace: workspace, extensionId: IExtensionIdentifier) {
        let mannager = this.extensionManagers.get(workspace)
        if (mannager) {
            mannager.disabledExtensions.forEach((extension: IMainExtension, index: number) => {
                if (extension.identifier == extensionId) {
                    mannager?.enabledExtensions.push(extension)
                    delete mannager?.disabledExtensions[index]
                }
            })
            // ClientStore.set(this.extensionStore, "extensionMannagers",)
        }
    }

    installExtension(extension: IMainExtension, workspace: workspace) {
        let mannager = this.extensionManagers.get(workspace)
        if (mannager) {
            mannager.enabledExtensions.push(extension)
        } else {
            console.log("不存在这个workspace")
        }
    }

    createExtensionManager(mannager: IExtensionManager) {
        if (this.extensionManagers.has(mannager.attributes.workSpace)) {
            return false
        } else {
            this.extensionManagers.set(mannager.attributes.workSpace, mannager)
            return true
        }
    }

    modifyExtensionManager(extensionManagerId: workspace) {
        let mannager = this.extensionManagers.get(extensionManagerId)
    }
}
class ExtensionActivator {
    static async activateExtension(workSpace: string, extension: IMainExtension) {
        if (existsSync(workSpace + extension.storage)) {
        }
        child_process.fork(extension.storage)
    }
}

class IpcServer {}
let a = new ExtensionManager()
a.loadExtensions()
//todo 劫持require并且注入api
