"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true, get: function () {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", {enumerable: true, value: v});
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.GlobalExtensionManager = exports.ExtensionManager = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const events_1 = __importDefault(require("events"));
const workspace_js_1 = require("./../workspace/workspace.js");
const store_js_1 = require("../store/store.js");
const activator_js_1 = require("./activator.js");
const ipc_handler_js_1 = require("../../platform/ipc/handlers/ipc.handler.js");
const ipc_events_js_1 = require("../../platform/ipc/events/ipc.events.js");
const enums_js_1 = require("../enums.js");

function verifyStoragePath(path) {
    return (0, fs_1.existsSync)(path);
}

class ExtensionManager extends events_1.default {
    attributes;
    enabledExtensions;
    disabledExtensions;
    onStart;

    constructor(manager) {
        super();
        this.attributes = manager.attributes;
        this.enabledExtensions = manager.enabledExtensions;
        this.disabledExtensions = manager.disabledExtensions;
        this.onStart = manager.onStart;
        this.loadExtensions();
    }

    async loadExtensions() {
        this.enabledExtensions.forEach((extension, index) => {
            if (this.onStart.includes(extension.identifier.id)) {
                activator_js_1.ExtensionActivator.activate(extension);
            } else {
                if (verifyStoragePath(extension.storage)) {
                    this.bindActivateEvents(extension);
                } else {
                    delete this.enabledExtensions[index];
                    this.emit('extension-invalid', extension);
                }
                // this.bindActivateEvents(extension)
            }
        });
    }

    enableExtension(extension) {
        if (verifyStoragePath(extension.storage)) {
            this.enabledExtensions.push(extension);
            return true;
        } else {
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
        } else {
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
            workspace_js_1.GlobalWorkspaceManager.addProjectExtend(extension.projectExtend);
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

    addExtensionOnStart(extensionId) {
        this.enabledExtensions.forEach((extension) => {
            if (extension.identifier.id == extensionId) {
                this.onStart.push(extensionId);
            }
        });
    }

    removeExtensionOnStart(extensionId) {
        this.onStart.find((id, index) => {
            if (id == extensionId) {
                delete this.onStart[index];
            }
        });
    }

    bindActivateEvents(extension) {
        extension.onEvents.forEach((event) => {
            //todo 修改考虑插件的项目数据恢复
            ipc_handler_js_1.ipcClient.once(event, async () => {
                activator_js_1.ExtensionActivator.activate(extension);
            });
        });
    }

    modifyManager(attributes) {
        if (attributes && verifyStoragePath(attributes.storagePath)) {
            this.attributes = attributes;
        }
    }

    beforeClose() {
        activator_js_1.ExtensionActivator.beforeClose();
    }
}

exports.ExtensionManager = ExtensionManager;

class GlobalExtensionManager {
    workspace;
    extensionManagers;
    currentManager;

    constructor(workspace) {
        this.workspace = workspace;
        this.extensionManagers = new Map();
        store_js_1.ClientStore.create({
            name: enums_js_1.moduleStoreNames.extension,
            fileExtension: 'json',
            clearInvalidConfig: true,
        });
        this.startUp();
        // ipcClient.emit('extension:ready')
    }

    async startUp() {
        this.hookRequire((0, path_1.join)(__dirname, '..', '..', '/platform/platform'));
        await this.initActivator();
        await this.loadAllManagers();
        await this.bindEventsToMain();
    }

    /**
     * @description 将api注入到插件运行过程中,通过劫持extension.js文件的require
     *  然后替换其中的uniclient字段改为api实际路径
     * @param apiPath
     */
    async hookRequire(apiPath) {
        const pirates = await Promise.resolve().then(() => __importStar(require('pirates')));
        //替换字符串中的转义字符
        apiPath = apiPath.replace(/\\/g, '/');
        //匹配者:只针对extension.js文件进行api的替换
        // const matcher = (fileName: string) => {
        //     if (fileName.endsWith('extension.js')) return true
        //     return false
        // }
        pirates.addHook((code, filename) => {
            return code.replace(/require\((['"])uniclient\1\)/, `require("${apiPath}")`);
        }, {exts: ['.js']});
    }

    loadAllManagers() {
        let managers = {
            extensionManagers: store_js_1.ClientStore.get(enums_js_1.moduleStoreNames.extension, 'extensionManagers'),
            globalExtensionManager: store_js_1.ClientStore.get(enums_js_1.moduleStoreNames.extension, 'globalExtensionManager'),
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
        }
        this.extensionManagers.set('currentManager', this.currentManager);
        //监听无效扩展事件
        this.currentManager.on('extension-invalid', (extension) => {
            console.log(extension.identifier);
        });
    }

    produceExtensionManager(extensionManager) {
        this.extensionManagers.set(extensionManager.attributes.workspaceName, extensionManager);
    }

    //启动activator.js文件作为一个子进程存在
    initActivator() {
        // ProcessManager.createChildProcess(
        //     join(__dirname, './activator.js'),
        //     moduleName.extensionActivator
        // )
        require((0, path_1.join)(__dirname, './activator.js'));
    }

    /**
     * @description 将插件相关的所有事件绑定到主进程上面,并且制定了相关listener
     */
    bindEventsToMain() {
        //绑定插件安装
        ipc_handler_js_1.ipcClient.on(ipc_events_js_1.rendererEvents.extensionEvents.install, (event, workspace, extension) => {
            if (this.workspace.workspaceName != 'global' && workspace == 'global') {
                let gm = store_js_1.ClientStore.get(enums_js_1.moduleStoreNames.extension, 'globalExtensionManager');
                gm.enabledExtensions.push(extension);
                store_js_1.ClientStore.set(enums_js_1.moduleStoreNames.extension, 'globalExtensionManager', gm);
            } else {
                this.currentManager.installExtension(extension);
            }
        });
        //绑定插件卸载方法
        ipc_handler_js_1.ipcClient.on(ipc_events_js_1.rendererEvents.extensionEvents.uninstall, (event, workspace, extension) => {
            if (this.workspace.workspaceName != 'global' && workspace == 'global') {
                let gm = store_js_1.ClientStore.get(enums_js_1.moduleStoreNames.extension, 'globalExtensionManager');
                gm.enabledExtensions.push(extension);
                store_js_1.ClientStore.set(enums_js_1.moduleStoreNames.extension, 'globalExtensionManager', gm);
            } else {
                this.currentManager.uninstallExtension(extension);
            }
        });
        //绑定新建workspace方法,如果是全局则不会新建extensionManager
        ipc_handler_js_1.ipcClient.on(ipc_events_js_1.rendererEvents.workspaceEvents.create, (event, workspace, storage) => {
            if (workspace != 'global') {
                let m = {
                    attributes: {
                        workspaceName: workspace,
                        storagePath: storage,
                    },
                    onStart: [],
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
            onStart: [],
            enabledExtensions: [],
            disabledExtensions: [],
        };
        this.extensionManagers.set(manager.attributes.workspaceName, manager);
    }

    updateStoreOfManagers() {
        if (store_js_1.ClientStore.set(enums_js_1.moduleStoreNames.extension, 'extensionManagers', [...this.extensionManagers.values()])) {
            return true;
        } else {
            console.log('出错');
        }
    }

    createExtensionManager(manager) {
        if (this.extensionManagers.has(manager.attributes.workspaceName)) {
            return false;
        } else {
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
        this.currentManager.beforeClose();
        activator_js_1.ExtensionActivator.beforeClose();
    }
}

exports.GlobalExtensionManager = GlobalExtensionManager;
//todo platform中的服务都是提供给插件可以使用的,应该重构代码模块
