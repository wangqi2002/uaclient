import { app } from "electron"

//todo 项目实现,手动输入命令实现,electron-squirrel-startup处理安装问题,处理全局路径问题,主进程中实现html页面的加载,插件加载问题

const userData = function getUserDataPath() {}
const codeCache = function getCodeCachePath() {}
// let clientLanguage = undefined
// if ("getPerferredSystemLanguages" in app) {
//     clientLanguage = app.getPerferredSystemLanguages()?.[0] ??'cn'
// }

function startUp(cachePath?: string, config?: any) {
    const createMainWindow = require("./workbench/workbench")
    createMainWindow()
}
async function onReady() {
    startUp()
}
let args = function parseCLIArgs() {}
app.once("ready", () => {
    if ("trace" in args) {
        const contentTrace = require("electron").contentTracing
        const traceOptions = {
            categoryFilter: /**args["trace-category-filter"] ||**/ "*",
            traceOptions: /**args["trace-options"] || **/ "record-until-full,enable-sampling",
        }
        contentTrace.startRecording(traceOptions).finally(() => {
            onReady()
        })
    } else {
        onReady()
    }
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})
