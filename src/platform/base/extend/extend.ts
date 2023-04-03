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
        storagePaht: string
    }
    enabledExtensions: IMainExtension[]
    disabledExtensions: IMainExtension[]
}
export interface IExtensionMannagers {
    extensionManagers: IExtensionManager[]
}
export class ExtensionManager {
    workspace: workspace
    enabledExtensions: Map<extensionId, IMainExtension>
    extensionManagers: Map<workspace, IExtensionManager>

    constructor() {
        this.workspace = "global"
        this.enabledExtensions = new Map()
        this.extensionManagers = new Map()
        this.loadMannagers()
    }

    loadMannagers() {
        let mannagers:IExtensionMannagers = require("./extension.json")
        mannagers.extensionManagers.forEach((extensionManager) => {
            this.extensionManagers.set(extensionManager.attributes.workSpace, extensionManager)
        })
    }

    loadExtensions() {
        let mannager = this.extensionManagers.get(this.workspace)
        if (mannager) {
            mannager.enabledExtensions.forEach((extension: IMainExtension) => {
                this.enabledExtensions.set(extension.identifier.id, extension)
                extension.onEvents.forEach((event) => {
                    ipcMain.once(event, () => {
                        this.activateExtension(extension)
                    })
                })
            })
        } else {
            console.log('不存在这个workspace')
        }
    }

    async activateExtension(extension: IMainExtension) {
        child_process.fork(extension.storage)
    }

    enableExtention() {}

    installExtension(extension: IMainExtension,workspace:workspace) {
        let mannager = this.extensionManagers.get(workspace)
        if (mannager) {
            mannager.enabledExtensions.push(extension)
        } else {
            console.log('不存在这个workspace')
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
        if () {
            
        }
    }
    // bindActivateEvent(event:string, extension:IMainExtension) {
    //     ipcMain.once(event, () => {
    //         this.activateExtension(extension)
    //     })
    // }
}

export class GlobalExtensionEnablement {
    constructor() {}

    async enableExtention(extension: IExtensionIdentifier, source: string) {
        return false
    }

    async disableExtention(extension: IExtensionIdentifier) {
        return false
    }
}

class ExtensionActivator {
    constructor() {}

    async loadMainExtension(extend: IMainExtension) {
        child_process.fork(extend.storage, {})
    }

    async loadRendererExtension() {
        // load页面/html或者js文件?通过iframe/webview,
    }

    extensionExsit() {
        return false
    }
}

class IpcServer {}
let a = new ExtensionManager().loadExtensions()
