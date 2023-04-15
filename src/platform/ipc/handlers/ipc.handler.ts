import {BrowserWindow, ipcMain, IpcMainEvent} from "electron"
import {rendererEvents} from "../events/ipc.events"
import {ClientError, ClientInfo, ClientWarn, Log} from "../../base/log/log"

export module eventsBind {
    export function workbenchInitBind(mainWindow: BrowserWindow) {
        ipcMain.on(rendererEvents.benchEvents.minimize, () => {
            mainWindow.minimize()
        })
        ipcMain.on(rendererEvents.benchEvents.maximize, () => {
            if (mainWindow.isMaximized()) {
                mainWindow.restore()
            } else {
                mainWindow.maximize()
            }
        })
        ipcMain.on(rendererEvents.benchEvents.close, () => {
            mainWindow.close()
        })
    }

    export function logInitBind() {
        ipcMain.on(rendererEvents.logEvents.info, (event, args: ClientInfo) => {
            Log.info(args)
        })
        ipcMain.on(rendererEvents.logEvents.error, (event, args: ClientError) => {
            Log.error(args)
        })
        ipcMain.on(rendererEvents.logEvents.warn, (event, args: ClientWarn) => {
            Log.warn(args)
        })
    }

    export function benchBind(
        event: rendererEvents.benchEvents,
        eventHandler: (event: IpcMainEvent, ...args: any[]) => void
    ) {
        ipcMain.on(event, eventHandler)
    }

    export function workspaceBind(
        event: rendererEvents.workspaceEvents,
        eventHandler: (event: IpcMainEvent, ...args: any[]) => void
    ) {
        ipcMain.on(event, eventHandler)
    }

    export function persistBind() {
        // ipcMain.on("persist:init", (event, storage, tableName, attributes) => {
        //     Persistence.init(storage, tableName, attributes)
        // })
    }

    export function extendBind(
        event: rendererEvents.extensionEvents,
        eventHandler: (event: Electron.IpcMainEvent, ...args: any[]) => void
    ) {
        ipcMain.on(event, eventHandler)
    }

    export function bindEvent(event: string, eventHandler: (event: IpcMainEvent, ...args: any[]) => void) {
        ipcMain.on(event, eventHandler)
    }

    export function onceBind(event: string, eventHandler: (event: IpcMainEvent, ...args: any[]) => void) {
        ipcMain.once(event, eventHandler)
    }
}

export module mainEmit {
    export function emit(event: string, ...args: any[]) {
        ipcMain.emit(event, ...args)
    }
}
