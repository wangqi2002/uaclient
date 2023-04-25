"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.ipcClient = void 0;
const electron_1 = require("electron");
const events_1 = __importDefault(require("events"));

class ipcClient {
    static localEvents = new events_1.default();
    static clientEvents = new events_1.default();
    // constructor(send: (channel: string, ...args: any[]) => void) {
    //     ipcClient.currentWindow = send
    // }
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
    static emitToRender(event, ...args) {
        // ipcClient.currentWindow(event, ...args)
        // ipcMain.emit(event, ...args)
        ipcClient.localEvents.emit('emitToRender', event, ...args);
    }

    static registerToEmit(event, eventHandler) {
        ipcClient.localEvents.on(event, eventHandler);
    }

    static emitLocal(event, ...args) {
        ipcClient.localEvents.emit(event, ...args);
    }

    static onLocal(event, handler) {
        ipcClient.localEvents.on(event, handler);
    }

    static onClient(event, handler) {
        ipcClient.clientEvents.on(event, handler);
    }

    static emitClient(event, ...args) {
        ipcClient.clientEvents.emit(event, ...args);
    }
}

exports.ipcClient = ipcClient;
