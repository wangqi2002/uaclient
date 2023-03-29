import { ModelAttributes } from "sequelize"
import { Workbench } from "./../workbench/workbench"
import path from "path"
import { Broker } from "./../platform/base/broker"
import { app, BrowserWindow, ipcMain } from "electron"
import { ErrorHandler } from "../platform/base/error"
import { ClientError, Log } from "../platform/base/log"
import { MainHandler } from "../platform/ipc/ipc.handler"
import async from "async"
import { Persistence } from "../platform/base/persistence"
import { ClientConfig } from "../platform/base/config"
export class Client {
    static workbench: Workbench
    static broker: Broker
    static logger: Log
    static persistor: Persistence
    static mainWindow: BrowserWindow

    constructor() {
        try {
            this.requestSingleInstance()
            this.startup()
            ipcMain.on("client:quit", () => {
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
            console.log("nice")
            throw e
        }
    }

    private initServices() {
        async.parallel([
            //初始化Broker中间转发者服务
            async () => {
                Client.broker = new Broker()
            },
            //初始化Log日志服务
            async () => {
                Client.logger = new Log()
            },
            //初始化持久化ORM服务
            async () => {
                let defaultAttributes = ClientConfig.get("modelAttribute") as ModelAttributes
                Client.persistor = new Persistence(
                    path.join(__dirname, "..", "..", "/databases/data.db"),
                    "2023", //TODO 处理数据库自动命名的问题
                    defaultAttributes
                )
            },
            //初始化插件服务
            async () => {},
        ])
    }

    private createWorkbench() {
        Client.workbench = new Workbench()
        Client.mainWindow = Client.workbench.getMainWindow()
    }

    private setErrorHandler(errorHandler: (error: any) => void) {
        ErrorHandler.setUnexpectedErrorHandler(errorHandler)
    }

    private quit() {
        async.series([
            //终结broker转发者服务
            async () => {
                Client.broker.terminateAllPipe()
            },
        ])
    }
}
export const client = new Client()
