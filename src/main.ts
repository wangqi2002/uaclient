import { MainHandler } from "./platform/ipc/mainHandler";

const { app, BrowserWindow, Menu, ipcMain, nativeTheme } = require("electron");
const path = require("path");
const { menu } = require("./workbench/menu");

//todo 配置文件使用electron-store模块数据保存在JSON文件中app.getPath(‘userData’)

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.resolve(__dirname, "./preload.js"),
    },
  });
  mainWindow.webContents.openDevTools();
  await mainWindow.loadFile(path.join(__dirname, "./workbench/index.html"));
  MainHandler.mainBind(mainWindow);
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
// app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//         createWindow()
//     }
// })
