"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ipc_handler_1 = require("./platform/ipc/ipc.handler");
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const electron_win_state_1 = __importDefault(require("electron-win-state"));
const electron_store_1 = __importDefault(require("electron-store"));
const { menu } = require("./workbench/menu");
//todo 配置文件使用electron-store模块数据保存在JSON文件中app.getPath(‘userData’)
new electron_store_1.default({
    name: 'client.config',
    fileExtension: 'json',
    cwd: electron_1.app.getPath('userData'),
    clearInvalidConfig: true,
});
electron_1.app.on("ready", () => {
    const winState = new electron_win_state_1.default({
        defaultWidth: electron_1.screen.getPrimaryDisplay().workAreaSize.width * 3 / 4,
        defaultHeight: electron_1.screen.getPrimaryDisplay().workAreaSize.height * 3 / 4,
    });
    const mainWindow = new electron_1.BrowserWindow(Object.assign(Object.assign({}, winState.winOptions), { frame: false, center: true, webPreferences: {
            preload: path_1.default.resolve(__dirname, "./preload.js"),
        } }));
    mainWindow.webContents.openDevTools();
    mainWindow.loadFile(path_1.default.join(__dirname, "./workbench/index.html"));
    ipc_handler_1.MainHandler.initBind(mainWindow);
    winState.manage(mainWindow);
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
// app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//         createWindow()
//     }
// })
