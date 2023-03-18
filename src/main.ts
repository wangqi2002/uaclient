const {app, BrowserWindow} = require('electron');
const path = require('path');

//todo 配置文件使用electron-store模块数据保存在JSON文件中app.getPath(‘userData’)
if (require('electron-squirrel-startup')) {
  app.quit()
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      frame: false,
      webPreferences: {
          preload: path.join(__dirname, 'preload.ts'),
      },
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.webContents.openDevTools();
}
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
})
