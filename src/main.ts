import {MainHandler} from "./platform/ipc/ipc.handler"
import {app, BrowserWindow, screen} from "electron"
import path from 'path'

const {menu} = require("./workbench/menu")

//todo 配置文件使用electron-store模块数据保存在JSON文件中app.getPath(‘userData’)

async function createWindow() {
    const mainWindow = new BrowserWindow({
        width: screen.getPrimaryDisplay().workAreaSize.width,
        height: screen.getPrimaryDisplay().workAreaSize.height / 2,
        frame: false,
        webPreferences: {
            preload: path.resolve(__dirname, "./preload.js"),
        },
    })

    mainWindow.webContents.openDevTools()
    await mainWindow.loadFile(path.join(__dirname, "./workbench/index.html"))
    MainHandler.initBind(mainWindow)
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
