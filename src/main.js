"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ipc_handler_1 = require("./platform/ipc/ipc.handler");
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const { menu } = require("./workbench/menu");
//todo 配置文件使用electron-store模块数据保存在JSON文件中app.getPath(‘userData’)
function createWindow() {
    return __awaiter(this, void 0, void 0, function* () {
        const mainWindow = new electron_1.BrowserWindow({
            width: electron_1.screen.getPrimaryDisplay().workAreaSize.width * 3/4,
            height: electron_1.screen.getPrimaryDisplay().workAreaSize.height *3/4,
            frame: false,
            webPreferences: {
                preload: path_1.default.resolve(__dirname, "./preload.js"),
            },
        });
        mainWindow.webContents.openDevTools();
        yield mainWindow.loadFile(path_1.default.join(__dirname, "./workbench/index.html"));
        ipc_handler_1.MainHandler.initBind(mainWindow);
    });
}
electron_1.app.on("ready", createWindow);
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
