"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainEmit = exports.eventsBind = void 0;
const electron_1 = require("electron");
const ipc_events_1 = require("../events/ipc.events");
const log_1 = require("../../base/log/log");
var eventsBind;
(function (eventsBind) {
    function workbenchInitBind(mainWindow) {
        electron_1.ipcMain.on(ipc_events_1.rendererEvents.benchEvents.minimize, () => {
            mainWindow.minimize();
        });
        electron_1.ipcMain.on(ipc_events_1.rendererEvents.benchEvents.maximize, () => {
            if (mainWindow.isMaximized()) {
                mainWindow.restore();
            }
            else {
                mainWindow.maximize();
            }
        });
        electron_1.ipcMain.on(ipc_events_1.rendererEvents.benchEvents.close, () => {
            mainWindow.close();
        });
    }
    eventsBind.workbenchInitBind = workbenchInitBind;
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
    eventsBind.logInitBind = logInitBind;
    function benchBind(event, eventHandler) {
        electron_1.ipcMain.on(event, eventHandler);
    }
    eventsBind.benchBind = benchBind;
    function workspaceBind(event, eventHandler) {
        electron_1.ipcMain.on(event, eventHandler);
    }
    eventsBind.workspaceBind = workspaceBind;
    function persistBind() {
        // ipcMain.on("persist:init", (event, storage, tableName, attributes) => {
        //     Persistence.init(storage, tableName, attributes)
        // })
    }
    eventsBind.persistBind = persistBind;
    function extendBind(event, eventHandler) {
        electron_1.ipcMain.on(event, eventHandler);
    }
    eventsBind.extendBind = extendBind;
    function bindEvent(event, eventHandler) {
        electron_1.ipcMain.on(event, eventHandler);
    }
    eventsBind.bindEvent = bindEvent;
    function onceBind(event, eventHandler) {
        electron_1.ipcMain.once(event, eventHandler);
    }
    eventsBind.onceBind = onceBind;
})(eventsBind = exports.eventsBind || (exports.eventsBind = {}));
var mainEmit;
(function (mainEmit) {
    function emit(event, ...args) {
        electron_1.ipcMain.emit(event, ...args);
    }
    mainEmit.emit = emit;
})(mainEmit = exports.mainEmit || (exports.mainEmit = {}));
