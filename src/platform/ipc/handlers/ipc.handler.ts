import { BrowserWindow, ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron'

export class ipcClient {
    static mainWindow: BrowserWindow

    constructor(mainWindow: BrowserWindow) {
        ipcClient.mainWindow = mainWindow
    }

    static on(event: string, eventHandler: (event: IpcMainEvent, ...args: any[]) => void) {
        ipcMain.on(event, eventHandler)
    }

    static once(event: string, eventHandler: (event: IpcMainEvent, ...args: any[]) => void) {
        ipcMain.once(event, eventHandler)
    }

    static handle(event: string, eventHandler: (event: IpcMainInvokeEvent, ...args: any[]) => void) {
        ipcMain.handle(event, eventHandler)
    }

    /**
     * @description 通过mainwindow进行广播,并且发送消息到mainwindow.webContents
     * @param event
     * @param args
     */
    static emit(event: string, ...args: any[]) {
        ipcClient.mainWindow.webContents.emit(event, ...args)
    }
}
