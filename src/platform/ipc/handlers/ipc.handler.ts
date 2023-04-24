import { ipcMain, IpcMainEvent, IpcMainInvokeEvent, BrowserWindow } from 'electron'
export class ipcClient {
    static currentWindow: (channel: string, ...args: any[]) => void

    constructor(send: (channel: string, ...args: any[]) => void) {
        ipcClient.currentWindow = send
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
        ipcClient.currentWindow(event, ...args)
    }
}
