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
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
//todo 项目实现,手动输入命令实现,electron-squirrel-startup处理安装问题,处理全局路径问题,主进程中实现html页面的加载,插件加载问题
const userData = function getUserDataPath() { };
const codeCache = function getCodeCachePath() { };
// let clientLanguage = undefined
// if ("getPerferredSystemLanguages" in app) {
//     clientLanguage = app.getPerferredSystemLanguages()?.[0] ??'cn'
// }
function startUp(cachePath, config) {
    const createMainWindow = require("./workbench/workbench");
    createMainWindow();
}
function onReady() {
    return __awaiter(this, void 0, void 0, function* () {
        startUp();
    });
}
let args = function parseCLIArgs() { };
electron_1.app.once("ready", () => {
    if ("trace" in args) {
        const contentTrace = require("electron").contentTracing;
        const traceOptions = {
            categoryFilter: /**args["trace-category-filter"] ||**/ "*",
            traceOptions: /**args["trace-options"] || **/ "record-until-full,enable-sampling",
        };
        contentTrace.startRecording(traceOptions).finally(() => {
            onReady();
        });
    }
    else {
        onReady();
    }
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
