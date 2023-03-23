"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.MainHandler = void 0;
const electron_1 = require("electron");
const ipc_events_1 = require("./ipc.events");
const log_1 = require("../base/log");
var MainHandler;
(function (MainHandler) {
    function initBind(mainWindow) {
        mainBind(mainWindow);
        logBind();
    }
    MainHandler.initBind = initBind;
    function mainBind(mainWindow) {
        electron_1.ipcMain.on(ipc_events_1.mainEvents.mainMenu, () => {
        });
        electron_1.ipcMain.on(ipc_events_1.mainEvents.mainMini, () => {
            mainWindow.minimize();
        });
        electron_1.ipcMain.on(ipc_events_1.mainEvents.mainMax, () => {
            if (mainWindow.isMaximized()) {
                mainWindow.restore();
            } else {
                mainWindow.maximize();
            }
        });
        electron_1.ipcMain.on(ipc_events_1.mainEvents.mainClose, () => {
            mainWindow.close();
        });
    }
    MainHandler.mainBind = mainBind;
    function logBind() {
        electron_1.ipcMain.on('log:info', (event, args) => {
            log_1.Log.info(args);
        });
        electron_1.ipcMain.on('log:error', (event, args) => {
            log_1.Log.error(args);
        });
        electron_1.ipcMain.on('log:warn', (event, args) => {
            log_1.Log.warn(args);
        });
    }
    MainHandler.logBind = logBind;
    function extendBind(event, func) {
        electron_1.ipcMain.on('extend:' + event, () => func);
    }
    MainHandler.extendBind = extendBind;
    function bindEvent(event, eventHandler) {
        electron_1.ipcMain.on(event, eventHandler);
    }
    MainHandler.bindEvent = bindEvent;
})(MainHandler = exports.MainHandler || (exports.MainHandler = {}));
