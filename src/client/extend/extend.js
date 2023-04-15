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
const workspace_1 = require("./../workspace/workspace");
const store_1 = require("../store/store");
const fs_1 = require("fs");
const electron_1 = require("electron");
const events_1 = __importDefault(require("events"));
const activator_1 = require("./activator");
const ipc_handler_1 = require("../../platform/ipc/handlers/ipc.handler");
const ipc_events_1 = require("../../platform/ipc/events/ipc.events");
const path_1 = __importDefault(require("path"));
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
                // this.bindActivateEvents(extension)
                if (verifyStoragePath(extension.storage)) {
                    this.bindActivateEvents(extension);
                }
                else {
                    delete this.enabledExtensions[index];
                    this.emit('extension-invalid', extension);
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
        let n = this.findExtension('disabled', extension);
        if (n != -1) {
            delete this.enabledExtensions[n];
            return true;
        }
    }
    findExtension(from, extension) {
        if (from == 'enabled') {
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
            //插入project extend到全局workspace管理的空间中
            workspace_1.GlobalWorkspaceManager.addProjectExtend(extension.projectExtend);
        }
    }
    uninstallExtension(extension) {
        if (verifyStoragePath(extension.storage)) {
            let n = this.findExtension('enabled', extension);
            if (n != -1) {
                delete this.enabledExtensions[n];
            }
        }
    }
    bindActivateEvents(extension) {
        extension.onEvents.forEach((event) => {
            //todo 修改考虑插件的项目数据恢复
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
    constructor(workspace) {
        this.extensionStore = 'extensions';
        this.workspace = workspace;
        this.extensionManagers = new Map();
        this.activator = new activator_1.ExtensionActivator();
        store_1.ClientStore.create({
            name: this.extensionStore,
            fileExtension: 'json',
            // cwd: app.getPath('appData'),
            cwd: 'C:\\Users\\Administrator\\Desktop\\client.data',
            clearInvalidConfig: true,
        });
        this.hookRequire(path_1.default.join(__dirname, '..', '..', '/platform/platform'));
        this.loadAllManagers();
        this.bindEventsToMain();
    }
    /**
     * @description 将api注入到插件运行过程中,通过劫持extension.js文件的require
     *  然后替换其中的uniclient字段改为api实际路径
     * @param apiPath
     */
    hookRequire(apiPath) {
        let addHook = require('pirates').addHook;
        const matcher = (fileName) => {
            if (fileName === 'extension.js')
                return true;
            return false;
        };
        addHook((code, filename) => {
            return code.replace(/require\((['"])uniclient\1\)/, () => {
                return `require("${apiPath}")`;
            });
        }, { exts: ['.js'], matcher });
    }
    loadAllManagers() {
        let managers = {
            extensionManagers: store_1.ClientStore.get(this.extensionStore, 'extensionManagers'),
            globalExtensionManager: store_1.ClientStore.get(this.extensionStore, 'globalExtensionManager'),
        };
        managers.extensionManagers.forEach((IManager) => {
            if (IManager.attributes.workspaceName == this.workspace.workspaceName) {
                this.currentManager = new ExtensionManager(IManager);
            }
            this.extensionManagers.set(IManager.attributes.workspaceName, IManager);
        });
        if (!this.currentManager) {
            //如果managers为空列表,那么就使用全局extension
            this.currentManager = new ExtensionManager(managers.globalExtensionManager);
            // this.createNewManagerForWS()
            // this.updateStoreOfManagers()
        }
        this.extensionManagers.set('currentManager', this.currentManager);
        //监听无效扩展事件
        this.currentManager.on('extension-invalid', (extension) => {
            console.log(extension.identifier);
        });
    }
    /**
     * @description 将插件相关的所有事件绑定到主进程上面,并且制定了相关listener
     */
    bindEventsToMain() {
        //绑定插件安装
        ipc_handler_1.eventsBind.extendBind(ipc_events_1.rendererEvents.extensionEvents.install, (event, workspace, extension) => {
            if (this.workspace.workspaceName != 'global' && workspace == 'global') {
                let gm = store_1.ClientStore.get(this.extensionStore, 'globalExtensionManager');
                gm.enabledExtensions.push(extension);
                store_1.ClientStore.set(this.extensionStore, 'globalExtensionManager', gm);
            }
            else {
                this.currentManager.installExtension(extension);
            }
        });
        //绑定插件卸载方法
        ipc_handler_1.eventsBind.extendBind(ipc_events_1.rendererEvents.extensionEvents.uninstall, (event, workspace, extension) => {
            if (this.workspace.workspaceName != 'global' && workspace == 'global') {
                let gm = store_1.ClientStore.get(this.extensionStore, 'globalExtensionManager');
                gm.enabledExtensions.push(extension);
                store_1.ClientStore.set(this.extensionStore, 'globalExtensionManager', gm);
            }
            else {
                this.currentManager.uninstallExtension(extension);
            }
        });
        //绑定新建workspace方法,如果是全局则不会新建extensionManager
        ipc_handler_1.eventsBind.workspaceBind(ipc_events_1.rendererEvents.workspaceEvents.create, (event, workspace, storage) => {
            if (workspace != 'global') {
                let m = {
                    attributes: {
                        workspaceName: workspace,
                        storagePath: storage,
                    },
                    enabledExtensions: [],
                    disabledExtensions: [],
                };
                this.createExtensionManager(m);
            }
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
        if (store_1.ClientStore.set(this.extensionStore, 'extensionManagers', [...this.extensionManagers.values()])) {
            return true;
        }
        else {
            console.log('出错');
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
        this.activator.beforeClose();
    }
}
exports.GlobalExtensionManager = GlobalExtensionManager;
function verifyStoragePath(path) {
    return (0, fs_1.existsSync)(path);
}
//todo platform中的服务都是提供给插件可以使用的,应该重构代码模块
