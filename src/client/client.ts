import { GlobalExtensionManager } from "./extend/extend"

import { ModelAttributes } from "sequelize"
import { Workbench } from "./../workbench/workbench"
import { Broker } from "../platform/base/broker/broker"
import { app, BrowserWindow } from "electron"
import { ErrorHandler } from "./error/error"
import { ClientError, Log } from "../platform/base/log/log"
import async from "async"
import { Persistence } from "../platform/base/persist/persistence"
import { ClientStore } from "../platform/base/store/store"
import { EventBind } from "../platform/ipc/handlers/ipc.handler"
import { rendererEvents } from "../platform/ipc/events/ipc.events"

const path = require("path")

class Client {
    workbench!: Workbench
    broker!: Broker
    persistor!: Persistence
    mainWindow!: BrowserWindow

    constructor() {
        try {
            this.requestSingleInstance()
            this.startup()
            EventBind.mainBind(rendererEvents.mainEvents.quit, () => {
                this.quit()
            })
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
        ErrorHandler.setUnexpectedErrorHandler((error: any) => {
            if ("source" in error) {
                Log.error(error)
            } else {
                Log.error(
                    new ClientError(
                        "Uncaught",
                        "An unexpected exception while client running",
                        error.message,
                        error.stack
                    )
                )
            }
        })
        try {
            await this.createWorkbench()
            await this.initServices()
        } catch (e: any) {
            console.log("出错了")
            throw e
        }
    }

    private initServices() {
        new ClientStore()
        async.parallel([
            //初始化Broker中间转发者服务
            async () => {
                this.broker = new Broker()
            },
            //初始化Log日志服务
            async () => {
                new Log()
            },
            //初始化ORM服务
            async () => {
                let defaultAttributes = ClientStore.get("config", "modelAttribute") as ModelAttributes
                this.persistor = new Persistence(
                    path.join(__dirname, "..", "..", "/databases/data.db"),
                    "2023", //TODO 处理数据库自动命名的问题
                    defaultAttributes
                )
            },
            //初始化插件服务
            async () => {
                new GlobalExtensionManager()
            },
            //初始化log服务
            async () => {
                new Log()
            },
            //初始化postbox服务
            async () => {},
        ])
    }

    private createWorkbench() {
        this.workbench = new Workbench(
            path.join(__dirname, "../workbench/preload.js"),
            path.join(__dirname, "../workbench/index.html"),
            true
        )
        this.mainWindow = this.workbench.getMainWindow()
        this.mainWindow.once("ready-to-show", () => {
            this.mainWindow.show()
        })
    }

    private setErrorHandler(errorHandler: (error: any) => void) {
        ErrorHandler.setUnexpectedErrorHandler(errorHandler)
    }

    private quit() {
        async.series([
            //终结broker转发者服务
            async () => {
                this.broker.onClose()
            },
        ])
    }
}
const client = new Client()
