import {ipcMain} from 'electron'
import {RendererEvents} from './ipc.events'
import {ClientError, ClientInfo, Log} from '../base/log'

export module MainHandler {
    import BrowserWindow = Electron.BrowserWindow

    export function initBind(mainWindow: BrowserWindow) {
        mainBind(mainWindow)
        logBind()
    }

    export function mainBind(mainWindow: BrowserWindow) {
        ipcMain.on(RendererEvents.mainMenu, () => {

        })
        ipcMain.on(RendererEvents.mainMini, () => {
            mainWindow.minimize()
        })
        ipcMain.on(RendererEvents.mainMax, () => {
            if (mainWindow.isMaximized()) {
                mainWindow.restore()
            } else {
                mainWindow.maximize()
            }
        })
        ipcMain.on(RendererEvents.mainClose, () => {
            mainWindow.close()
        })
    }

    export function logBind() {
        ipcMain.on('log:info', (event, args: ClientInfo) => {
            Log.info(args)
        })
        ipcMain.on('log:error', (event, args: ClientError) => {
            Log.error(args)
        })
        ipcMain.on('log:warn', (event, args: ClientError) => {
            Log.warn(args)
        })
    }

    export function extendBind(event: string, func: Function) {
        ipcMain.on('extend:' + event, () => func)
    }

    export function bindEvent(event: string, eventHandler: EventListener) {
        ipcMain.on(event, eventHandler)
    }
}