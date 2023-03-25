import async from "async"
import { app } from "electron"
import { ErrorHandler } from "../platform/base/error"
import { ClientError, Log } from "../platform/base/log"
import { MainHandler } from "../platform/ipc/ipc.handler"
class Client {
    constructor() {
        try {
            this.requestSingleInstance()
            this.startup()
        } catch (e: any) {
            console.error(e.message)
            app.exit(1)
        }
    }

    async startup() {
        ErrorHandler.setUnexpectedErrorHandler(function (error: any) {
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
            throw e
        }
    }

    private quit() {}

    private initServices() {
        async.series([])
    }

    createService() {}

    createWorkbench() {
        require("../workbench/workbench")
    }

    private setErrorHandler(errorHandler: (error: any) => void) {
        ErrorHandler.setUnexpectedErrorHandler(errorHandler)
    }

    requestSingleInstance() {
        if (!app.requestSingleInstanceLock()) {
            app.quit()
        }
    }
}
export const client = new Client()
