"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
const extend_js_1 = require("./extend/extend.js");
const workbench_js_1 = require("./../workbench/workbench.js");
const electron_1 = require("electron");
const error_js_1 = require("./error/error.js");
const log_js_1 = require("../platform/base/log/log.js");
const async_1 = __importDefault(require("async"));
const persistence_js_1 = require("../platform/base/persist/persistence.js");
const store_js_1 = require("./store/store.js");
const ipc_handler_js_1 = require("../platform/ipc/handlers/ipc.handler.js");
const ipc_events_js_1 = require("../platform/ipc/events/ipc.events.js");
const workspace_js_1 = require("./workspace/workspace.js");
const process_js_1 = require("./process/process.js");
const {ipcClient} = require('../platform/ipc/handlers/ipc.handler')
const path_1 = __importDefault(require("path"));

class Client {
    workbench;
    broker;
    persist;
    mainWindow;
    extensionManager;
    static dev;

    constructor(dev) {
        try {
            Client.dev = dev;
            this.requestSingleInstance();
            this.startup();
            this.bindQuitEvents();
        } catch (e) {
            console.error(e.message);
            electron_1.app.exit(1);
        }
    }

    requestSingleInstance() {
        if (!electron_1.app.requestSingleInstanceLock()) {
            electron_1.app.quit();
        }
    }

    async startup() {
        try {
            this.createBaseService();
            this.createWorkbench();
            this.initErrorHandler();
            await this.initServices();
        } catch (e) {
            console.log('出错了');
            throw e;
        }
    }

    initErrorHandler() {
        new error_js_1.ErrorHandler();
        error_js_1.ErrorHandler.setUnexpectedErrorHandler((error) => {
            if ('source' in error) {
                log_js_1.Log.error(error);
            } else {
                log_js_1.Log.error(new log_js_1.ClientError('Uncaught', 'An unexpected exception while client running', error.message, error.stack));
            }
        });
    }

    bindQuitEvents() {
        ipc_handler_js_1.ipcClient.on(ipc_events_js_1.rendererEvents.benchEvents.quit, () => {
            this.quit();
        });
        // app.on('window-all-closed', () => {
        //     this.quit()
        // })
    }

    createBaseService() {
        new store_js_1.ClientStore();
    }

    createWorkbench() {
        let {width, height} = store_js_1.ClientStore.get('config', 'border');
        this.workbench = new workbench_js_1.Workbench(path_1.default.join(__dirname, '../workbench/preload.js'), path_1.default.join(__dirname, '../workbench/index.html'), Client.dev, width, height);
        this.mainWindow = this.workbench.getMainWindow();
        this.mainWindow.webContents.once('did-finish-load', async () => {
            await this.mainWindow.show();
            ipc_handler_js_1.ipcClient.registerToEmit('emitToRender', (event, ...args) => {
                this.mainWindow.webContents.send(event, ...args);
            });
            //todo 处理这个问题
        });
    }

    async initServices() {
        async_1.default.parallel([
            //初始化Broker中间转发者服务
            // async () => {
            //     this.broker = new Broker()
            // },
            //初始化ORM服务
            async () => {
                // let defaultAttributes: ModelAttributes = ClientStore.get('config', 'modelAttribute')
                this.persist = new persistence_js_1.Persistence(); //TODO 处理数据库自动命名的问题
            },
            //初始化工作空间管理者
            async () => {
                new workspace_js_1.GlobalWorkspaceManager();
            },
            //初始化进程管理者
            async () => {
                new process_js_1.ProcessManager();
            },
            //初始化log服务
            async () => {
                new log_js_1.Log();
            },
            //初始化postbox服务
            async () => {
            },
        ]);
        this.extensionManager = new extend_js_1.GlobalExtensionManager(workspace_js_1.GlobalWorkspaceManager.getCurrentWSNames());
    }

    setErrorHandler(errorHandler) {
        error_js_1.ErrorHandler.setUnexpectedErrorHandler(errorHandler);
    }

    quit() {
        async_1.default.series([
            //终结broker转发者服务
            async () => {
                this.broker.beforeClose();
            },
            //结束extensionManager服务
            async () => {
                this.extensionManager.beforeClose();
            },
            async () => {
                this.workbench.beforeClose();
            },
        ]);
        electron_1.app.quit();
    }
}

const client = new Client();
ipcClient.onLocal('pipe:ua.pushed', (data) => {
    console.log(data, 'client')
})
