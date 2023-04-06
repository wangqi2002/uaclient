import {GlobalWorkspaceManager} from "./../workspace/workspace"
import {ClientStore} from "../store/store"
import {existsSync} from "fs"
import {app, ipcMain} from "electron"
import EventEmitter from "events"
import {ExtensionActivator} from "./activator"
import {eventsBind} from "../../platform/ipc/handlers/ipc.handler"
import {rendererEvents} from "../../platform/ipc/events/ipc.events"
import {workspace} from "../workspace/workspace"

type extensionStorage = string
type extensionActivateEvent = string

export interface IExtensionIdentifier {
    id: string
    uuid: string | null
}

export interface IMainExtension {
    version: string
    engine: string
    identifier: IExtensionIdentifier
    storage: extensionStorage
    renderPath: string | null
    isJsExtension: boolean
    onEvents: extensionActivateEvent[]
    projectExtend: string[]
}

export interface IExtensionManager {
    attributes: workspace
    enabledExtensions: IMainExtension[]
    disabledExtensions: IMainExtension[]
}
export interface IExtensionManagers {
    extensionManagers: IExtensionManager[]
    globalExtensionManager: IExtensionManager
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
            //插入project extend到全局workspace管理的空间中
            GlobalWorkspaceManager.addProjectExtend(extension.projectExtend)
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
            ipcMain.once(event, async () => {
                ExtensionActivator.activateExtension(extension)
            })
        })
    }

    modifyManager(attributes?: { workspaceName: string; storagePath: string }) {
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

    constructor(workspace: workspace) {
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
            globalExtensionManager: ClientStore.get(this.extensionStore, "globalExtensionManager"),
        }

        managers.extensionManagers.forEach((IManager) => {
            if (IManager.attributes.workspaceName == this.workspace.workspaceName) {
                this.currentManager = new ExtensionManager(IManager)
            }
            this.extensionManagers.set(IManager.attributes.workspaceName, IManager)
        })
        if (!this.currentManager) {
            //如果managers为空列表,那么就使用全局extension
            this.currentManager = new ExtensionManager(managers.globalExtensionManager)
            // this.createNewManagerForWS()
            // this.updateStoreOfManagers()
        }
        this.extensionManagers.set("currentManager", this.currentManager)
        //监听无效扩展事件
        this.currentManager.on("extension-invalid", (extension: IMainExtension) => {
            console.log(extension.identifier)
        })
    }

    /**
     * @description 将插件相关的所有事件绑定到主进程上面,并且制定了相关listener
     */
    bindEventsToMain() {
        //绑定插件安装
        eventsBind.extendBind(
            rendererEvents.extensionEvents.install,
            (event, workspace: string, extension: IMainExtension) => {
                if (this.workspace.workspaceName != "global" && workspace == "global") {
                    let gm: IExtensionManager = ClientStore.get(this.extensionStore, "globalExtensionManager")
                    gm.enabledExtensions.push(extension)
                    ClientStore.set(this.extensionStore, "globalExtensionManager", gm)
                } else {
                    this.currentManager.installExtension(extension)
                }
            }
        )
        //绑定插件卸载方法
        eventsBind.extendBind(
            rendererEvents.extensionEvents.uninstall,
            (event, workspace: string, extension: IMainExtension) => {
                if (this.workspace.workspaceName != "global" && workspace == "global") {
                    let gm: IExtensionManager = ClientStore.get(this.extensionStore, "globalExtensionManager")
                    gm.enabledExtensions.push(extension)
                    ClientStore.set(this.extensionStore, "globalExtensionManager", gm)
                } else {
                    this.currentManager.uninstallExtension(extension)
                }
            }
        )
        //绑定新建workspace方法,如果是全局则不会新建extensionManager
        eventsBind.workspaceBind(rendererEvents.workspaceEvents.create, (event, workspace: string, storage: string) => {
            if (workspace != "global") {
                let m: IExtensionManager = {
                    attributes: {
                        workspaceName: workspace,
                        storagePath: storage,
                    },
                    enabledExtensions: [],
                    disabledExtensions: [],
                }
                this.createExtensionManager(m)
            }
        })
    }

    createNewManagerForWS() {
        let manager: IExtensionManager = {
            attributes: this.workspace,
            enabledExtensions: [],
            disabledExtensions: [],
        }
        this.extensionManagers.set(manager.attributes.workspaceName, manager)
    }

    updateStoreOfManagers() {
        if (ClientStore.set(this.extensionStore, "extensionManagers", [...this.extensionManagers.values()])) {
            return true
        } else {
            console.log("出错")
        }
    }

    createExtensionManager(manager: IExtensionManager) {
        if (this.extensionManagers.has(manager.attributes.workspaceName)) {
            return false
        } else {
            this.extensionManagers.set(manager.attributes.workspaceName, manager)
            this.currentManager = new ExtensionManager(manager)
            this.updateStoreOfManagers()
            return true
        }
    }

    modifyExtensionManager(managerWorkSpace: string) {
        let manager = this.extensionManagers.get(managerWorkSpace)
    }

    beforeClose() {
        this.updateStoreOfManagers()
    }
}

function verifyStoragePath(path: string) {
    return existsSync(path)
}

//todo platform中的服务都是提供给插件可以使用的,应该重构代码模块
