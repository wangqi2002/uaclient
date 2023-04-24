import { BrowserView, BrowserWindow } from 'electron';
import path from 'path';
import { EventEmitter } from 'events';
import { rendererEvents } from '../platform/ipc/events/ipc.events.js';
import { ipcClient } from '../platform/ipc/handlers/ipc.handler.js';
import { FileTransfer } from '../client/path/path.js';
export class Workbench extends EventEmitter {
    existViews;
    mainWindow;
    constructor(width, height, preload, homeViewPath, dev = false) {
        super();
        // this.winState = new WinState({
        //     defaultWidth: (screen.getPrimaryDisplay().workAreaSize.width * 3) / 4,
        //     defaultHeight: (screen.getPrimaryDisplay().workAreaSize.height * 3) / 4,
        // })
        this.createMainWindow(preload, homeViewPath, dev, width, height);
        this.existViews = new Map();
    }
    async createMainWindow(preloadPath = path.join(FileTransfer.dirname(import.meta.url), './preload.js'), indexHtmlPath = path.join(FileTransfer.dirname(import.meta.url), './index.html'), dev = false, width, height) {
        this.mainWindow = new BrowserWindow({
            // ...this.winState.winOptions,
            frame: false,
            center: true,
            show: false,
            webPreferences: {
                preload: preloadPath,
                devTools: true,
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
        if (dev) {
            this.mainWindow.webContents.openDevTools();
        }
        await this.mainWindow.loadFile(indexHtmlPath);
        // await this.mainWindow.loadURL("https://www.electronjs.org/zh/docs/latest/api/app")
        this.initBind(this.mainWindow);
        // this.winState.manage(this.mainWindow)
    }
    initBind(mainWindow) {
        ipcClient.on(rendererEvents.benchEvents.minimize, () => {
            mainWindow.minimize();
        });
        ipcClient.on(rendererEvents.benchEvents.maximize, () => {
            if (mainWindow.isMaximized()) {
                mainWindow.restore();
            }
            else {
                mainWindow.maximize();
            }
        });
        ipcClient.on(rendererEvents.benchEvents.close, () => {
            mainWindow.close();
        });
    }
    async createWindow(viewUrl, isWebView) {
        const window = new BrowserWindow({
            // ...this.winState.winOptions,
            frame: false,
        });
        isWebView ? await window.loadFile(viewUrl) : await window.loadURL(viewUrl);
    }
    async createView(viewId, viewUrl, rectangle = { x: 0, y: 0, width: 300, height: 300 }, isWebView = false) {
        if (this.existViews.has(viewId)) {
            return false;
        }
        const browserView = new BrowserView({
            webPreferences: {
                nodeIntegration: true,
                devTools: true,
                enablePreferredSizeMode: true,
            },
        });
        isWebView
            ? await browserView.webContents.loadURL(viewUrl).then(() => {
                this.mainWindow.addBrowserView(browserView);
            })
            : await browserView.webContents.loadFile(viewUrl).then(() => {
                this.mainWindow.addBrowserView(browserView);
            });
        browserView.setBounds(rectangle);
        browserView.setAutoResize({
            horizontal: true,
            width: true,
            vertical: false,
            height: false,
        });
        // browserView.webContents.openDevTools()
        // this.bindCloseEvent(viewId, browserView)
        this.existViews.set(viewId, browserView);
        this.emit('created:view.' + viewId);
        return true;
    }
    getMainWindow() {
        return this.mainWindow;
    }
    beforeClose() {
        this.emit('close');
    }
}
// export const workbench = new Workbench()
// export const mainWindow = workbench.getMainWindow()
//todo 命令inline名称获取
//todo 调试ua.servant
