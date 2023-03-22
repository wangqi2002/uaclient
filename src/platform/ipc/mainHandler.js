"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainHandler = void 0;
const electron_1 = require("electron");
const ipcEvents_1 = require("./ipcEvents");
var MainHandler;
(function (MainHandler) {
    function mainBind(mainWindow) {
        electron_1.ipcMain.on(ipcEvents_1.RendererEvents.mainMenu, () => {
        });
        electron_1.ipcMain.on(ipcEvents_1.RendererEvents.mainMini, () => {
            mainWindow.minimize();
        });
        electron_1.ipcMain.on(ipcEvents_1.RendererEvents.mainMax, () => {
            if (mainWindow.isMaximized()) {
                mainWindow.restore();
            }
            else {
                mainWindow.maximize();
            }
        });
        electron_1.ipcMain.on(ipcEvents_1.RendererEvents.mainClose, () => {
            mainWindow.close();
        });
    }
    MainHandler.mainBind = mainBind;
})(MainHandler = exports.MainHandler || (exports.MainHandler = {}));
