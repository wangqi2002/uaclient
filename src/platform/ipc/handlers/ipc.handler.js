"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipcClient = void 0;
const electron_1 = require("electron");
class ipcClient {
    constructor(mainWindow) {
        ipcClient.mainWindow = mainWindow;
    }
    static on(event, eventHandler) {
        electron_1.ipcMain.on(event, eventHandler);
    }
    static once(event, eventHandler) {
        electron_1.ipcMain.once(event, eventHandler);
    }
    static handle(event, eventHandler) {
        electron_1.ipcMain.handle(event, eventHandler);
    }
    /**
     * @description 通过mainwindow进行广播,并且发送消息到mainwindow.webContents
     * @param event
     * @param args
     */
    static emit(event, ...args) {
        ipcClient.mainWindow.webContents.emit(event, ...args);
    }
}
exports.ipcClient = ipcClient;
