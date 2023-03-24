import async from "async"
import { app, BrowserWindow, ipcMain, screen } from "electron"
import WinState from "electron-win-state"
import path from "path"
import { ErrorHandler } from "../platform/base/error"
import { ClientError, Log } from "../platform/base/log"
import { MainHandler } from "../platform/ipc/ipc.handler"
class ClientMain {
    main(): void {
        try {
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
            await this.initServices()
        } catch (e: any) {
            throw e
        }
    }

    quit() {}

    initServices() {
        async.series([])
    }

    createService() {}

    setErrorHandler() {}

    claimInstance() {}
}

export async function createMainWindow() {
    const winState = new WinState({
        defaultWidth: (screen.getPrimaryDisplay().workAreaSize.width * 3) / 4,
        defaultHeight: (screen.getPrimaryDisplay().workAreaSize.height * 3) / 4,
    })
    const mainWindow = new BrowserWindow({
        ...winState.winOptions,
        frame: false,
        center: true,
        webPreferences: {
            preload: path.resolve(__dirname, "./preload.js"),
        },
    })
    mainWindow.webContents.openDevTools()
    await mainWindow.loadFile(path.join(__dirname, "./workbench/index.html"))
    MainHandler.initBind(mainWindow)
    winState.manage(mainWindow)
}
