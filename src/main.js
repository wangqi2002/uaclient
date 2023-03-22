"use strict"
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value)
                  })
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value))
                } catch (e) {
                    reject(e)
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value))
                } catch (e) {
                    reject(e)
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next())
        })
    }
Object.defineProperty(exports, "__esModule", { value: true })
const mainHandler_1 = require("./platform/ipc/mainHandler")
const { app, BrowserWindow, Menu, ipcMain, nativeTheme } = require("electron")
const path = require("path")
const { menu } = require("./workbench/menu")
//todo 配置文件使用electron-store模块数据保存在JSON文件中app.getPath(‘userData’)
function createWindow() {
    return __awaiter(this, void 0, void 0, function* () {
        const mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            frame: false,
            webPreferences: {
                preload: path.resolve(__dirname, "./preload.js"),
            },
        })
        mainWindow.webContents.openDevTools()
        yield mainWindow.loadFile(path.join(__dirname, "./workbench/index.html"))
        mainHandler_1.MainHandler.mainBind(mainWindow)
    })
}
app.on("ready", createWindow)
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})
// app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//         createWindow()
//     }
// })
