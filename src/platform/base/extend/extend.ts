import { ClientWarn } from "../log/log"
import { MainHandler } from "../../ipc/handlers/ipc.handler"
import child_process from "child_process"
//todo 修改以使用child_process执行插件
import Store from "electron-store"
import { app } from "electron"

type extensionStorage = string
type extensionActivateEvent = string
type extensionName = string
type workspace = string | "global"

const extensionStore = new Store({
    name: "config",
    fileExtension: "json",
    cwd: app.getPath("userData"),
    clearInvalidConfig: true,
})

export interface IExtensionIdentifier {
    id: string
    uuid?: string
}
export interface IMainExtension {
    identifier: IExtensionIdentifier
    isJsExtension: boolean
    onEvents: extensionActivateEvent[]
    storage: extensionStorage
    version: string
    engine: string
    name: string
    workspace: workspace
}

export class ExtensionManager {
    extensions: Map<extensionName, IMainExtension>
    constructor() {
        this.extensions = new Map()
    }
    loadExtensions() {
        //从json文件中加载
        let extension = require("./extension.json")
    }

    async activateExtension() {}

    enableExtention() {}

    installExtension() {}
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
