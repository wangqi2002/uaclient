"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainEmit = exports.EventBind = void 0;
const electron_1 = require("electron");
const ipc_events_1 = require("../events/ipc.events");
const log_1 = require("../../base/log/log");
var EventBind;
(function (EventBind) {
    function workbenchInitBind(mainWindow) {
        electron_1.ipcMain.on(ipc_events_1.rendererEvents.mainEvents.minimize, () => {
            mainWindow.minimize();
        });
        electron_1.ipcMain.on(ipc_events_1.rendererEvents.mainEvents.maximize, () => {
            if (mainWindow.isMaximized()) {
                mainWindow.restore();
            }
            else {
                mainWindow.maximize();
            }
        });
        electron_1.ipcMain.on(ipc_events_1.rendererEvents.mainEvents.close, () => {
            mainWindow.close();
        });
    }
    EventBind.workbenchInitBind = workbenchInitBind;
    function logInitBind() {
        electron_1.ipcMain.on(ipc_events_1.rendererEvents.logEvents.info, (event, args) => {
            log_1.Log.info(args);
        });
        electron_1.ipcMain.on(ipc_events_1.rendererEvents.logEvents.error, (event, args) => {
            log_1.Log.error(args);
        });
        electron_1.ipcMain.on(ipc_events_1.rendererEvents.logEvents.warn, (event, args) => {
            log_1.Log.warn(args);
        });
    }
    EventBind.logInitBind = logInitBind;
    function mainBind(event, eventHandler) {
        electron_1.ipcMain.on(event, eventHandler);
    }
    EventBind.mainBind = mainBind;
    function persistBind() {
        // ipcMain.on("persist:init", (event, storage, tableName, attributes) => {
        //     Persistence.init(storage, tableName, attributes)
        // })
    }
    EventBind.persistBind = persistBind;
    function extendBind(event, eventHandler) {
        electron_1.ipcMain.on(event, eventHandler);
    }
    EventBind.extendBind = extendBind;
    function bindEvent(event, eventHandler) {
        electron_1.ipcMain.on(event, eventHandler);
    }
    EventBind.bindEvent = bindEvent;
    function onceBind(event, eventHandler) {
        electron_1.ipcMain.once(event, eventHandler);
    }
    EventBind.onceBind = onceBind;
})(EventBind = exports.EventBind || (exports.EventBind = {}));
var mainEmit;
(function (mainEmit) {
    function emit(event, ...args) {
        electron_1.ipcMain.emit(event, ...args);
    }
    mainEmit.emit = emit;
})(mainEmit = exports.mainEmit || (exports.mainEmit = {}));
