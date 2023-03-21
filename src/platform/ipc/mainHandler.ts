import {ipcMain} from 'electron'
import {RendererEvents} from './ipcEvents'

export module MainHandler {
    import BrowserWindow = Electron.BrowserWindow

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

    export function bindEvent(event: string, eventHandler: Function) {
        ipcMain.on(event, () => eventHandler)
    }
}