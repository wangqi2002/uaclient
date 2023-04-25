import { join } from 'path'
import { existsSync } from 'fs'
import EventEmitter from 'events'
import { GlobalWorkspaceManager } from './../workspace/workspace.js'
import { ClientStore } from '../store/store.js'
import { ExtensionActivator } from './activator.js'
import { ipcClient } from '../../platform/ipc/handlers/ipc.handler.js'
import { rendererEvents } from '../../platform/ipc/events/ipc.events.js'
import { workspace } from '../workspace/workspace.js'
import { ProcessManager } from '../process/process.js'
import { moduleName, moduleStoreNames } from '../enums.js'
import { Workbench } from '../../workbench/workbench.js'
import { FileTransfer } from '../path/path.js'

type extensionStorage = string
type extensionActivateEvent = string
type workspaceName = string

export interface IExtensionIdentifier {
    id: string
    uuid: string | null
}

export interface IExtension {
    version: string
    engine: string
    identifier: IExtensionIdentifier
    storage: extensionStorage
    onEvents: extensionActivateEvent[]
    projectExtend: string[]
}

export interface IExtensionManager {
    attributes: workspace
    onStart: string[]
    enabledExtensions: IExtension[]
    disabledExtensions: IExtension[]
}
export interface IGlobalExtensionInfo {
    extensionManagers: IExtensionManager[]
    globalExtensionManager: IExtensionManager
}

export interface IGlobalExtensionManager {
    workspace: workspace
    extensionManagers: Map<workspaceName, IExtensionManager>
    currentManager: ExtensionManager
}

function verifyStoragePath(path: string) {
    return existsSync(path)
}
export class ExtensionManager extends EventEmitter implements IExtensionManager {
    attributes: workspace
    enabledExtensions: IExtension[]
    disabledExtensions: IExtension[]
    onStart: string[]

    constructor(manager: IExtensionManager) {
        super()
        this.attributes = manager.attributes
        this.enabledExtensions = manager.enabledExtensions
        this.disabledExtensions = manager.disabledExtensions
        this.onStart = manager.onStart
        this.loadExtensions()
    }

    async loadExtensions() {
        this.enabledExtensions.forEach((extension: IExtension, index: number) => {
            if (this.onStart.includes(extension.identifier.id)) {
                ExtensionActivator.activate(extension)
            } else {
                if (verifyStoragePath(extension.storage)) {
                    this.bindActivateEvents(extension)
                } else {
                    delete this.enabledExtensions[index]
                    this.emit('extension-invalid', extension)
                }
                // this.bindActivateEvents(extension)
            }
        })
    }

    enableExtension(extension: IExtension) {
        if (verifyStoragePath(extension.storage)) {
            this.enabledExtensions.push(extension)
            return true
        } else {
            return false
        }
    }

    disableExtension(extension: IExtension) {
        let n = this.findExtension('disabled', extension)
        if (n != -1) {
            delete this.enabledExtensions[n]
            return true
        }
    }

    findExtension(from: string, extension: IExtension): number {
        if (from == 'enabled') {
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

    installExtension(extension: IExtension) {
        if (verifyStoragePath(extension.storage)) {
            this.enabledExtensions.push(extension)
            //插入project extend到全局workspace管理的空间中
            GlobalWorkspaceManager.addProjectExtend(extension.projectExtend)
        }
    }

    uninstallExtension(extension: IExtension) {
        if (verifyStoragePath(extension.storage)) {
            let n = this.findExtension('enabled', extension)
            if (n != -1) {
                delete this.enabledExtensions[n]
            }
        }
    }

    addExtensionOnStart(extensionId: string) {
        this.enabledExtensions.forEach((extension) => {
            if (extension.identifier.id == extensionId) {
                this.onStart.push(extensionId)
            }
        })
    }

    removeExtensionOnStart(extensionId: string) {
        this.onStart.find((id, index) => {
            if (id == extensionId) {
                delete this.onStart[index]
            }
        })
    }

    bindActivateEvents(extension: IExtension) {
        extension.onEvents.forEach((event) => {
            //todo 修改考虑插件的项目数据恢复
            ipcClient.once(event, async () => {
                ExtensionActivator.activate(extension)
            })
        })
    }

    modifyManager(attributes?: { workspaceName: string; storagePath: string }) {
        if (attributes && verifyStoragePath(attributes.storagePath)) {
            this.attributes = attributes
        }
    }

    beforeClose() {
        ExtensionActivator.beforeClose()
    }
}

export class GlobalExtensionManager implements IGlobalExtensionManager {
    workspace: workspace
    extensionManagers: Map<workspaceName, IExtensionManager>
    currentManager!: ExtensionManager

    constructor(workspace: workspace) {
        this.workspace = workspace
        this.extensionManagers = new Map()
        ClientStore.create({
            name: moduleStoreNames.extension,
            fileExtension: 'json',
            clearInvalidConfig: true,
        })
        this.startUp()
        // ipcClient.emit('extension:ready')
    }

    async startUp() {
        this.hookRequire(join(__dirname, '..', '..', '/platform/platform'))
        await this.initActivator()
        await this.loadAllManagers()
        await this.bindEventsToMain()
    }

    /**
     * @description 将api注入到插件运行过程中,通过劫持extension.js文件的require
     *  然后替换其中的uniclient字段改为api实际路径
     * @param apiPath
     */
    async hookRequire(apiPath: string) {
        const pirates = await import('pirates')
        //替换字符串中的转义字符
        apiPath = apiPath.replace(/\\/g, '/')
        //匹配者:只针对extension.js文件进行api的替换
        // const matcher = (fileName: string) => {
        //     if (fileName.endsWith('extension.js')) return true
        //     return false
        // }
        pirates.addHook(
            (code: string, filename: string) => {
                return code.replace(/require\((['"])uniclient\1\)/, `require("${apiPath}")`)
            },
            { exts: ['.js'] }
        )
    }

    loadAllManagers() {
        let managers: IGlobalExtensionInfo = {
            extensionManagers: ClientStore.get(moduleStoreNames.extension, 'extensionManagers'),
            globalExtensionManager: ClientStore.get(moduleStoreNames.extension, 'globalExtensionManager'),
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
        }
        this.extensionManagers.set('currentManager', this.currentManager)
        //监听无效扩展事件
        this.currentManager.on('extension-invalid', (extension: IExtension) => {
            console.log(extension.identifier)
        })
    }

    produceExtensionManager(extensionManager: IExtensionManager) {
        this.extensionManagers.set(extensionManager.attributes.workspaceName, extensionManager)
    }

    //启动activator.js文件作为一个子进程存在
    initActivator() {
        ProcessManager.createChildProcess(
            join(__dirname, './src/client/extend/activator.js'),
            moduleName.extensionActivator
        )
    }

    /**
     * @description 将插件相关的所有事件绑定到主进程上面,并且制定了相关listener
     */
    bindEventsToMain() {
        //绑定插件安装
        ipcClient.on(rendererEvents.extensionEvents.install, (event, workspace: string, extension: IExtension) => {
            if (this.workspace.workspaceName != 'global' && workspace == 'global') {
                let gm: IExtensionManager = ClientStore.get(moduleStoreNames.extension, 'globalExtensionManager')
                gm.enabledExtensions.push(extension)
                ClientStore.set(moduleStoreNames.extension, 'globalExtensionManager', gm)
            } else {
                this.currentManager.installExtension(extension)
            }
        })
        //绑定插件卸载方法
        ipcClient.on(rendererEvents.extensionEvents.uninstall, (event, workspace: string, extension: IExtension) => {
            if (this.workspace.workspaceName != 'global' && workspace == 'global') {
                let gm: IExtensionManager = ClientStore.get(moduleStoreNames.extension, 'globalExtensionManager')
                gm.enabledExtensions.push(extension)
                ClientStore.set(moduleStoreNames.extension, 'globalExtensionManager', gm)
            } else {
                this.currentManager.uninstallExtension(extension)
            }
        })
        //绑定新建workspace方法,如果是全局则不会新建extensionManager
        ipcClient.on(rendererEvents.workspaceEvents.create, (event, workspace: string, storage: string) => {
            if (workspace != 'global') {
                let m: IExtensionManager = {
                    attributes: {
                        workspaceName: workspace,
                        storagePath: storage,
                    },
                    onStart: [],
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
            onStart: [],
            enabledExtensions: [],
            disabledExtensions: [],
        }
        this.extensionManagers.set(manager.attributes.workspaceName, manager)
    }

    updateStoreOfManagers() {
        if (ClientStore.set(moduleStoreNames.extension, 'extensionManagers', [...this.extensionManagers.values()])) {
            return true
        } else {
            console.log('出错')
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
        this.currentManager.beforeClose()
        ExtensionActivator.beforeClose()
    }
}

//todo platform中的服务都是提供给插件可以使用的,应该重构代码模块
