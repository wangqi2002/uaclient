import { BrowserView, BrowserWindow, Rectangle, screen } from 'electron'
import WinState from 'electron-win-state'
import path from 'path'
import { EventEmitter } from 'stream'
import { rendererEvents } from '../platform/ipc/events/ipc.events'
import { ipcClient } from '../platform/ipc/handlers/ipc.handler'

type viewId = string

export class Workbench extends EventEmitter {
    public winState: WinState<unknown>
    private existViews: Map<viewId, BrowserView>
    private mainWindow!: BrowserWindow

    constructor(preload?: string, homeViewPath?: string, dev: boolean = false) {
        super()
        this.winState = new WinState({
            defaultWidth: (screen.getPrimaryDisplay().workAreaSize.width * 3) / 4,
            defaultHeight: (screen.getPrimaryDisplay().workAreaSize.height * 3) / 4,
        })
        this.createMainWindow(preload, homeViewPath, dev)
        this.existViews = new Map()
    }

    private async createMainWindow(
        preloadPath: string = path.join(__dirname, './preload.js'),
        indexHtmlPath: string = path.join(__dirname, './index.html'),
        dev: boolean = false
    ) {
        this.mainWindow = new BrowserWindow({
            ...this.winState.winOptions,
            frame: false,
            center: true,
            show: false,
            webPreferences: {
                preload: preloadPath,
                devTools: true,
                nodeIntegration: true,
                contextIsolation: false,
            },
        })
        if (dev) {
            this.mainWindow.webContents.openDevTools()
        }
        await this.mainWindow.loadFile(indexHtmlPath)
        // await this.mainWindow.loadURL("https://www.electronjs.org/zh/docs/latest/api/app")
        this.initBind(this.mainWindow)
        this.winState.manage(this.mainWindow)
    }

    initBind(mainWindow: BrowserWindow) {
        ipcClient.on(rendererEvents.benchEvents.minimize, () => {
            mainWindow.minimize()
        })
        ipcClient.on(rendererEvents.benchEvents.maximize, () => {
            if (mainWindow.isMaximized()) {
                mainWindow.restore()
            } else {
                mainWindow.maximize()
            }
        })
        ipcClient.on(rendererEvents.benchEvents.close, () => {
            mainWindow.close()
        })
    }

    public async createWindow(viewUrl: string, isWebView: boolean) {
        const window = new BrowserWindow({
            ...this.winState.winOptions,
            frame: false,
        })
        isWebView ? await window.loadFile(viewUrl) : await window.loadURL(viewUrl)
    }

    public async createView(
        viewId: string,
        viewUrl: string,
        rectangle: Rectangle = { x: 0, y: 0, width: 300, height: 300 },
        isWebView: boolean = false
    ) {
        if (this.existViews.has(viewId)) {
            return false
        }
        const browserView = new BrowserView({
            webPreferences: {
                nodeIntegration: true,
                devTools: true,
                enablePreferredSizeMode: true,
            },
        })

        isWebView
            ? await browserView.webContents.loadURL(viewUrl).then(() => {
                  this.mainWindow.addBrowserView(browserView)
              })
            : await browserView.webContents.loadFile(viewUrl).then(() => {
                  this.mainWindow.addBrowserView(browserView)
              })
        browserView.setBounds(rectangle)
        browserView.setAutoResize({
            horizontal: true,
            width: true,
            vertical: false,
            height: false,
        })
        // browserView.webContents.openDevTools()
        // this.bindCloseEvent(viewId, browserView)
        this.existViews.set(viewId, browserView)
        this.emit('created:view.' + viewId)
        return true
    }

    public getMainWindow(): BrowserWindow {
        return this.mainWindow
    }

    beforeClose() {
        this.emit('close')
    }

    // private bindCloseEvent(viewId: string, view: BrowserView) {
    //     EventBind.onceBind()
    //     ipcMain.once("close:view." + viewId, () => {
    //         view.webContents.close()
    //     })
    // }
}
// export const workbench = new Workbench()
// export const mainWindow = workbench.getMainWindow()
//todo 命令inline名称获取
//todo 调试ua.servant
