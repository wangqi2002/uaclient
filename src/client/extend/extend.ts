import { ClientStore } from "../../platform/base/store/store"
import { existsSync } from "fs"
import { app, ipcMain, ipcRenderer } from "electron"
import EventEmitter from "events"
import { ExtensionActivator } from "./activator"
import { EventBind } from "../../platform/ipc/handlers/ipc.handler"
import { rendererEvents } from "../../platform/ipc/events/ipc.events"

type extensionStorage = string
type extensionActivateEvent = string
type workspace = {
    workspace: string
    storagePath: string
}

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
    attributes: workspace
    enabledExtensions: IMainExtension[]
    disabledExtensions: IMainExtension[]
}
export interface IExtensionManagers {
    extensionManagers: IExtensionManager[]
}

function verifyStoragePath(path: string) {
    return existsSync(path)
}

class ExtensionManager extends EventEmitter implements IExtensionManager {
    attributes: workspace
    enabledExtensions: IMainExtension[]
    disabledExtensions: IMainExtension[]

    constructor(attributes: IExtensionManager) {
        super()
        this.attributes = attributes.attributes
        this.enabledExtensions = attributes.enabledExtensions
        this.disabledExtensions = attributes.disabledExtensions
        this.loadExtensions()
    }

    async loadExtensions() {
        this.enabledExtensions.forEach((extension: IMainExtension, index: number) => {
            //todo xiugai
            // this.bindActivateEvents(extension)
            if (verifyStoragePath(extension.storage)) {
                this.bindActivateEvents(extension)
            } else {
                delete this.enabledExtensions[index]
                this.emit("extension-invalid", extension)
            }
        })
    }

    enableExtension(extension: IMainExtension) {
        if (verifyStoragePath(extension.storage)) {
            this.enabledExtensions.push(extension)
            return true
        } else {
            return false
        }
    }

    disableExtension(extension: IMainExtension) {
        let n = this.findExtension("disabled", extension)
        if (n != -1) {
            delete this.enabledExtensions[n]
            return true
        }
    }

    findExtension(from: string, extension: IMainExtension): number {
        if (from == "enabled") {
            this.enabledExtensions.find((extend, index) => {
                if (extend.identifier === extension.identifier) {
                    return index
                }
            })
        } else {
            this.disabledExtensions.find((extend, index) => {
                if (extend.identifier === extension.identifier) {
                    return index
                }
            })
        }
        return -1
    }

    installExtension(extension: IMainExtension) {
        if (verifyStoragePath(extension.storage)) {
            this.enabledExtensions.push(extension)
        }
    }

    uninstallExtension(extension: IMainExtension) {
        if (verifyStoragePath(extension.storage)) {
            let n = this.findExtension("enabled", extension)
            if (n != -1) {
                delete this.enabledExtensions[n]
            }
        }
    }

    bindActivateEvents(extension: IMainExtension) {
        extension.onEvents.forEach((event) => {
            //todo 修改
            ExtensionActivator.activateExtension(extension)
            ipcMain.once(event, async () => {
                ExtensionActivator.activateExtension(extension)
            })
        })
    }

    modifyManager(attributes?: { workspace: string; storagePath: string }) {
        if (attributes && verifyStoragePath(attributes.storagePath)) {
            this.attributes = attributes
        }
    }
}

export class GlobalExtensionManager {
    workspace: workspace
    extensionManagers: Map<string, IExtensionManager>
    currentManager!: ExtensionManager
    extensionStore = "extensions"

    constructor(
        workspace: workspace = {
            workspace: "global",
            storagePath: "F:\\idea_projects\\uaclient\\src\\plugins\\ua.client\\ua.servant",
        }
    ) {
        this.workspace = workspace
        this.extensionManagers = new Map()
        new ExtensionActivator()
        ClientStore.create({
            name: this.extensionStore,
            fileExtension: "json",
            cwd: app.getPath("appData"),
            // cwd: "C:\\Users\\Administrator\\Desktop\\client.data",
            clearInvalidConfig: true,
        })
        this.loadAllManagers()
        this.bindEventsToMain()
    }

    loadAllManagers() {
        let managers: IExtensionManagers = {
            extensionManagers: ClientStore.get(this.extensionStore, "extensionManagers"),
        }

        managers.extensionManagers.forEach((IManager) => {
            if (IManager.attributes.workspace == this.workspace.workspace) {
                this.currentManager = new ExtensionManager(IManager)
            }
            this.extensionManagers.set(IManager.attributes.workspace, IManager)
        })
        if (!this.currentManager) {
            this.createNewManagerForWS()
            this.updateStoreOfManagers()
        }
        //监听无效扩展事件
        this.currentManager.on("extension-invalid", (extension: IMainExtension) => {
            console.log(extension.identifier)
        })
    }

    bindEventsToMain() {
        EventBind.extendBind(
            rendererEvents.extensionEvents.install,
            (event, workspace: string, extension: IMainExtension) => {
                this.currentManager.installExtension(extension)
            }
        )
        EventBind.extendBind(
            rendererEvents.extensionEvents.uninstall,
            (event, workspace: string, extension: IMainExtension) => {
                this.currentManager.uninstallExtension(extension)
            }
        )
        ipcMain.on("workspace:create", (event, workspace: string, storage: string) => {
            let m: IExtensionManager = {
                attributes: {
                    workspace: workspace,
                    storagePath: storage,
                },
                enabledExtensions: [],
                disabledExtensions: [],
            }
            this.createExtensionManager(m)
        })
    }

    createNewManagerForWS() {
        let manager: IExtensionManager = {
            attributes: this.workspace,
            enabledExtensions: [],
            disabledExtensions: [],
        }
        this.extensionManagers.set(manager.attributes.workspace, manager)
    }

    updateStoreOfManagers() {
        if (ClientStore.set(this.extensionStore, "extensionManagers", [...this.extensionManagers.values()])) {
            return true
        } else {
            console.log("出错")
        }
    }

    createExtensionManager(manager: IExtensionManager) {
        if (this.extensionManagers.has(manager.attributes.workspace)) {
            return false
        } else {
            this.extensionManagers.set(manager.attributes.workspace, manager)
            this.currentManager = new ExtensionManager(manager)
            this.updateStoreOfManagers()
            return true
        }
    }

    modifyExtensionManager(managerWorkSpace: string) {
        let manager = this.extensionManagers.get(managerWorkSpace)
    }

    whenClosed() {
        this.updateStoreOfManagers()
    }
}

//todo platform中的服务都是提供给插件可以使用的,应该重构代码模块
