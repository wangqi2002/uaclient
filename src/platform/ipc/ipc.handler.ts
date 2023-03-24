import {ipcMain} from 'electron'
import {mainEvents} from './ipc.events'
import {ClientError, ClientInfo, Log} from '../base/log'
import {Persistence} from '../base/persistence'

export module MainHandler {
    import BrowserWindow = Electron.BrowserWindow

    export function initBind(mainWindow: BrowserWindow) {
        mainBind(mainWindow)
        logBind()
        persistBind()
    }

    export function mainBind(mainWindow: BrowserWindow) {
        ipcMain.on(mainEvents.mainMenu, () => {

        })
        ipcMain.on(mainEvents.mainMini, () => {
            mainWindow.minimize()
        })
        ipcMain.on(mainEvents.mainMax, () => {
            if (mainWindow.isMaximized()) {
                mainWindow.restore()
            } else {
                mainWindow.maximize()
            }
        })
        ipcMain.on(mainEvents.mainClose, () => {
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

    export function persistBind() {
        ipcMain.on('persist:init', (event, tableName, attributes) => {
            Persistence.init(tableName, attributes)
        })
    }

    export function extendBind(event: string, func: ) {
        ipcMain.on('extend:' + event, () => func)
    }

    export function bindEvent(event: string, eventHandler: EventListener) {
        ipcMain.on(event, eventHandler)
    }
}