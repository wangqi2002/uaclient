import { GlobalExtensionManager } from './extend/extend.js'
import { ModelAttributes } from 'sequelize'
import { Workbench } from './../workbench/workbench.js'
import { Broker } from '../platform/base/broker/broker.js'
import { app, BrowserWindow } from 'electron'
import { ErrorHandler } from './error/error.js'
import { ClientError, Log } from '../platform/base/log/log.js'
import async from 'async'
import { Persistence } from '../platform/base/persist/persistence.js'
import { ClientStore } from './store/store.js'
import { ipcClient } from '../platform/ipc/handlers/ipc.handler.js'
import { rendererEvents } from '../platform/ipc/events/ipc.events.js'
import { GlobalWorkspaceManager } from './workspace/workspace.js'
import { Utils } from '../platform/base/utils/utils.js'
import { ProcessManager } from './process/process.js'

import path from 'path'
import { FileTransfer } from './path/path.js'

class Client {
    workbench!: Workbench
    broker!: Broker
    persist!: Persistence
    mainWindow!: BrowserWindow
    extensionManager!: GlobalExtensionManager
    static dev: boolean | undefined

    constructor(dev?: boolean) {
        try {
            Client.dev = dev
            this.requestSingleInstance()
            this.startup()
            this.bindQuitEvents()
        } catch (e: any) {
            console.error(e.message)
            app.exit(1)
        }
    }

    private requestSingleInstance() {
        if (!app.requestSingleInstanceLock()) {
            app.quit()
        }
    }

    private async startup() {
        try {
            this.createBaseService()
            this.createWorkbench()
            this.initErrorHandler()
            await this.initServices()
        } catch (e: any) {
            console.log('出错了')
            throw e
        }
    }

    private initErrorHandler() {
        new ErrorHandler()
        ErrorHandler.setUnexpectedErrorHandler((error: any) => {
            if ('source' in error) {
                Log.error(error)
            } else {
                Log.error(
                    new ClientError(
                        'Uncaught',
                        'An unexpected exception while client running',
                        error.message,
                        error.stack
                    )
                )
            }
        })
    }

    private bindQuitEvents() {
        ipcClient.on(rendererEvents.benchEvents.quit, () => {
            this.quit()
        })
        // app.on('window-all-closed', () => {
        //     this.quit()
        // })
    }

    private createBaseService() {
        new ClientStore()
    }

    private createWorkbench() {
        let { width, height } = ClientStore.get('config', 'border')
        this.workbench = new Workbench(
            path.join(FileTransfer.dirname(import.meta.url), '../workbench/preload.js'),
            path.join(FileTransfer.dirname(import.meta.url), './src/workbench/index.html'),
            Client.dev,
            width,
            height
        )
        this.mainWindow = this.workbench.getMainWindow()
        this.mainWindow.webContents.once('did-finish-load', async () => {
            await this.mainWindow.show()
            ipcClient.currentWindow = this.mainWindow.webContents.send
            //todo 处理这个问题
        })
    }

    private async initServices() {
        async.parallel([
            //初始化Broker中间转发者服务
            // async () => {
            //     this.broker = new Broker()
            // },
            //初始化ORM服务
            async () => {
                // let defaultAttributes: ModelAttributes = ClientStore.get('config', 'modelAttribute')
                this.persist = new Persistence() //TODO 处理数据库自动命名的问题
            },
            //初始化工作空间管理者
            async () => {
                new GlobalWorkspaceManager()
            },
            //初始化进程管理者
            async () => {
                new ProcessManager()
            },
            //初始化log服务
            async () => {
                new Log()
            },
            //初始化postbox服务
            async () => {},
        ])
        this.extensionManager = new GlobalExtensionManager(GlobalWorkspaceManager.getCurrentWSNames())
    }

    private setErrorHandler(errorHandler: (error: any) => void) {
        ErrorHandler.setUnexpectedErrorHandler(errorHandler)
    }

    private quit() {
        async.series([
            //终结broker转发者服务
            async () => {
                this.broker.beforeClose()
            },
            //结束extensionManager服务
            async () => {
                this.extensionManager.beforeClose()
            },
            async () => {
                this.workbench.beforeClose()
            },
        ])
        app.quit()
    }
}
const client = new Client()
