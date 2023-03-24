import { BrowserWindow, screen } from "electron"
import WinState from "electron-win-state"
import path from "path"
import { MainHandler } from "../platform/ipc/ipc.handler"

class ClientMain {}

export async function createMainWindow() {
    const winState = new WinState({
        defaultWidth: (screen.getPrimaryDisplay().workAreaSize.width * 3) / 4,
        defaultHeight: (screen.getPrimaryDisplay().workAreaSize.height * 3) / 4,
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
    await mainWindow.loadFile(path.join(__dirname, "./workbench/index.html"))
    MainHandler.initBind(mainWindow)
    winState.manage(mainWindow)
}
