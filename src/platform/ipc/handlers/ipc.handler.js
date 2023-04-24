import { ipcMain } from 'electron';
export class ipcClient {
    static currentWindow;
    constructor(send) {
        ipcClient.currentWindow = send;
    }
    static on(event, eventHandler) {
        ipcMain.on(event, eventHandler);
    }
    static once(event, eventHandler) {
        ipcMain.once(event, eventHandler);
    }
    static handle(event, eventHandler) {
        ipcMain.handle(event, eventHandler);
    }
    /**
     * @description 通过mainwindow进行广播,并且发送消息到mainwindow.webContents
     * @param event
     * @param args
     */
    static emit(event, ...args) {
        ipcClient.currentWindow(event, ...args);
    }
}
