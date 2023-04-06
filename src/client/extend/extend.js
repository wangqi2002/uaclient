"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExtensionManager = void 0;
const store_1 = require("../store/store");
const fs_1 = require("fs");
const electron_1 = require("electron");
const events_1 = __importDefault(require("events"));
const activator_1 = require("./activator");
const ipc_handler_1 = require("../../platform/ipc/handlers/ipc.handler");
const ipc_events_1 = require("../../platform/ipc/events/ipc.events");
function verifyStoragePath(path) {
    return (0, fs_1.existsSync)(path);
}
class ExtensionManager extends events_1.default {
    constructor(attributes) {
        super();
        this.attributes = attributes.attributes;
        this.enabledExtensions = attributes.enabledExtensions;
        this.disabledExtensions = attributes.disabledExtensions;
        this.loadExtensions();
    }
    loadExtensions() {
        return __awaiter(this, void 0, void 0, function* () {
            this.enabledExtensions.forEach((extension, index) => {
                //todo xiugai
                // this.bindActivateEvents(extension)
                if (verifyStoragePath(extension.storage)) {
                    this.bindActivateEvents(extension);
                }
                else {
                    delete this.enabledExtensions[index];
                    this.emit("extension-invalid", extension);
                }
            });
        });
    }
    enableExtension(extension) {
        if (verifyStoragePath(extension.storage)) {
            this.enabledExtensions.push(extension);
            return true;
        }
        else {
            return false;
        }
    }
    disableExtension(extension) {
        let n = this.findExtension("disabled", extension);
        if (n != -1) {
            delete this.enabledExtensions[n];
            return true;
        }
    }
    findExtension(from, extension) {
        if (from == "enabled") {
            this.enabledExtensions.find((extend, index) => {
                if (extend.identifier === extension.identifier) {
                    return index;
                }
            });
        }
        else {
            this.disabledExtensions.find((extend, index) => {
                if (extend.identifier === extension.identifier) {
                    return index;
                }
            });
        }
        return -1;
    }
    installExtension(extension) {
        if (verifyStoragePath(extension.storage)) {
            this.enabledExtensions.push(extension);
        }
    }
    uninstallExtension(extension) {
        if (verifyStoragePath(extension.storage)) {
            let n = this.findExtension("enabled", extension);
            if (n != -1) {
                delete this.enabledExtensions[n];
            }
        }
    }
    bindActivateEvents(extension) {
        extension.onEvents.forEach((event) => {
            //todo 修改
            // ExtensionActivator.activateExtension(extension)
            electron_1.ipcMain.once(event, () => __awaiter(this, void 0, void 0, function* () {
                activator_1.ExtensionActivator.activateExtension(extension);
            }));
        });
    }
    modifyManager(attributes) {
        if (attributes && verifyStoragePath(attributes.storagePath)) {
            this.attributes = attributes;
        }
    }
}
class GlobalExtensionManager {
    constructor(workspace = {
        workspaceName: "global",
        storagePath: "F:\\idea_projects\\uaclient\\src\\plugins\\ua.client\\ua.servant",
    }) {
        this.extensionStore = "extensions";
        this.workspace = workspace;
        this.extensionManagers = new Map();
        new activator_1.ExtensionActivator();
        store_1.ClientStore.create({
            name: this.extensionStore,
            fileExtension: "json",
            cwd: electron_1.app.getPath("appData"),
            // cwd: "C:\\Users\\Administrator\\Desktop\\client.data",
            clearInvalidConfig: true,
        });
        this.loadAllManagers();
        this.bindEventsToMain();
    }
    loadAllManagers() {
        let managers = {
            extensionManagers: store_1.ClientStore.get(this.extensionStore, "extensionManagers"),
        };
        managers.extensionManagers.forEach((IManager) => {
            if (IManager.attributes.workspaceName == this.workspace.workspaceName) {
                this.currentManager = new ExtensionManager(IManager);
            }
            this.extensionManagers.set(IManager.attributes.workspaceName, IManager);
        });
        if (!this.currentManager) {
            this.createNewManagerForWS();
            this.updateStoreOfManagers();
        }
        //监听无效扩展事件
        this.currentManager.on("extension-invalid", (extension) => {
            console.log(extension.identifier);
        });
    }
    bindEventsToMain() {
        ipc_handler_1.EventBind.extendBind(ipc_events_1.rendererEvents.extensionEvents.install, (event, workspace, extension) => {
            this.currentManager.installExtension(extension);
        });
        ipc_handler_1.EventBind.extendBind(ipc_events_1.rendererEvents.extensionEvents.uninstall, (event, workspace, extension) => {
            this.currentManager.uninstallExtension(extension);
        });
        electron_1.ipcMain.on("workspace:create", (event, workspace, storage) => {
            let m = {
                attributes: {
                    workspaceName: workspace,
                    storagePath: storage,
                },
                enabledExtensions: [],
                disabledExtensions: [],
            };
            this.createExtensionManager(m);
        });
    }
    createNewManagerForWS() {
        let manager = {
            attributes: this.workspace,
            enabledExtensions: [],
            disabledExtensions: [],
        };
        this.extensionManagers.set(manager.attributes.workspaceName, manager);
    }
    updateStoreOfManagers() {
        if (store_1.ClientStore.set(this.extensionStore, "extensionManagers", [...this.extensionManagers.values()])) {
            return true;
        }
        else {
            console.log("出错");
        }
    }
    createExtensionManager(manager) {
        if (this.extensionManagers.has(manager.attributes.workspaceName)) {
            return false;
        }
        else {
            this.extensionManagers.set(manager.attributes.workspaceName, manager);
            this.currentManager = new ExtensionManager(manager);
            this.updateStoreOfManagers();
            return true;
        }
    }
    modifyExtensionManager(managerWorkSpace) {
        let manager = this.extensionManagers.get(managerWorkSpace);
    }
    beforeClose() {
        this.updateStoreOfManagers();
    }
}
exports.GlobalExtensionManager = GlobalExtensionManager;
//todo platform中的服务都是提供给插件可以使用的,应该重构代码模块
