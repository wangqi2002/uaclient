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
exports.mainWindow = exports.workbench = exports.Workbench = void 0;
const electron_1 = require("electron");
const electron_win_state_1 = __importDefault(require("electron-win-state"));
const path_1 = __importDefault(require("path"));
const stream_1 = require("stream");
const ipc_handler_1 = require("../platform/ipc/ipc.handler");
class Workbench extends stream_1.EventEmitter {
    constructor(preload, homeView, dev = false) {
        super();
        this.winState = new electron_win_state_1.default({
            defaultWidth: (electron_1.screen.getPrimaryDisplay().workAreaSize.width * 3) / 4,
            defaultHeight: (electron_1.screen.getPrimaryDisplay().workAreaSize.height * 3) / 4,
        });
        this.createMainWindow(preload, homeView, dev);
        this.exsitViews = new Map();
    }
    createMainWindow(preloadPath = path_1.default.join(__dirname, "../preload.js"), indexHtmlPath = path_1.default.join(__dirname, "./index.html"), dev = false) {
        return __awaiter(this, void 0, void 0, function* () {
            this.mainWindow = new electron_1.BrowserWindow(Object.assign(Object.assign({}, this.winState.winOptions), { frame: false, center: true, webPreferences: {
                    // preload: path.join(__dirname, preloadPath),
                    devTools: true,
                } }));
            if (dev) {
                this.mainWindow.webContents.openDevTools();
            }
            // this.mainWindow.webContents.openDevTools({
            //     mode: "right",
            //     activate: true,
            // })
            // await this.mainWindow.loadFile(indexHtmlPath)
            yield this.mainWindow.loadURL("https://www.electronjs.org/zh/docs/latest/api/app");
            this.mainWindow.once("ready-to-show", () => {
                this.mainWindow.show();
            });
            ipc_handler_1.MainHandler.initBind(this.mainWindow);
            this.winState.manage(this.mainWindow);
        });
    }
    createWindow(viewUrl, isWebView) {
        return __awaiter(this, void 0, void 0, function* () {
            const window = new electron_1.BrowserWindow(Object.assign(Object.assign({}, this.winState.winOptions), { frame: false }));
            isWebView ? yield window.loadFile(viewUrl) : yield window.loadURL(viewUrl);
        });
    }
    createView(viewId, viewUrl, isWebView = false, rectangle = { x: 0, y: 0, width: 300, height: 300 }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.exsitViews.has(viewId)) {
                return false;
            }
            const browserView = new electron_1.BrowserView({
                webPreferences: {
                    nodeIntegration: true,
                    devTools: true,
                    enablePreferredSizeMode: true,
                },
            });
            this.mainWindow.addBrowserView(browserView);
            isWebView ? yield browserView.webContents.loadURL(viewUrl) : yield browserView.webContents.loadFile(viewUrl);
            browserView.setBounds(rectangle);
            browserView.setAutoResize({
                horizontal: true,
                width: true,
                vertical: false,
                height: false,
            });
            browserView.webContents.openDevTools();
            this.bindCloseEvent(viewId, browserView);
            this.exsitViews.set(viewId, browserView);
            this.emit("view:created");
        });
    }
    getMainWindow() {
        return this.mainWindow;
    }
    bindCloseEvent(viewId, view) {
        electron_1.ipcMain.once("close:" + viewId, () => {
            view.webContents.close();
        });
    }
}
exports.Workbench = Workbench;
exports.workbench = new Workbench();
exports.mainWindow = exports.workbench.getMainWindow();
//todo 命令inline名称获取
