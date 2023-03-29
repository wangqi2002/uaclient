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
exports.ClientMain = void 0;
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
//todo 项目实现,手动输入命令实现,electron-squirrel-startup处理安装问题,处理全局路径问题,主进程中实现html页面的加载,插件加载问题
//todo 全局监听报错
var ClientMain;
(function (ClientMain) {
    require("v8-compile-cache");
    const product = require("./platform/product.json");
    ClientMain.userDataPath = getUserDataPath();
    ClientMain.workspacePath = electron_1.app.setPath("userData", ClientMain.userDataPath);
    electron_1.Menu.setApplicationMenu(null);
    const codeCachePath = getCodeCachePath();
    // let clientLanguage = undefined
    // if ("getPerferredSystemLanguages" in app) {
    //     clientLanguage = app.getPerferredSystemLanguages()?.[0] ??'cn'
    // }
    electron_1.app.whenReady().then(() => {
        onReady();
    });
    electron_1.app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            electron_1.app.quit();
        }
    });
    function getUserDataPath() {
        return product["rootDir"];
    }
    function getCodeCachePath() {
        const commit = product.commit;
        if (!commit) {
            return undefined;
        }
        return path_1.default.join(ClientMain.userDataPath, "CacheData", commit);
    }
    function startUp(cachePath, config) {
        require("./client/client");
    }
    function onReady() {
        return __awaiter(this, void 0, void 0, function* () {
            startUp();
        });
    }
})(ClientMain = exports.ClientMain || (exports.ClientMain = {}));
