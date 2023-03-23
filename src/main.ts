import {MainHandler} from "./platform/ipc/ipc.handler"
import {app, BrowserWindow, screen} from "electron"
import path from 'path'
import WinState from 'electron-win-state'

//todo 项目实现,手动输入命令实现,electron-squirrel-startup处理安装问题,处理全局路径问题,主进程中实现html页面的加载,插件加载问题


app.on("ready", () => {
    const winState = new WinState({
        defaultWidth: screen.getPrimaryDisplay().workAreaSize.width * 3 / 4,
        defaultHeight: screen.getPrimaryDisplay().workAreaSize.height * 3 / 4,
    })
    const mainWindow = new BrowserWindow({
        ...winState.winOptions,
        frame: false,
        center: true,
        webPreferences: {
            preload: path.resolve(__dirname, "./preload.js"),
        },

    })
    mainWindow.webContents.openDevTools()
    mainWindow.loadFile(path.join(__dirname, "./workbench/index.html"))
    MainHandler.initBind(mainWindow)
    winState.manage(mainWindow)
})

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