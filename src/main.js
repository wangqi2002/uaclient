import { app, Menu } from "electron"
import path from "path"
//todo 项目实现,手动输入命令实现,electron-squirrel-startup处理安装问题,处理全局路径问题,主进程中实现html页面的加载,插件加载问题
//todo 全局监听报错
export module ClientMain {
    require("v8-compile-cache")
    const product = require("./platform/product.json")
    export const userDataPath = getUserDataPath()

    export const workspacePath = app.setPath("userData", userDataPath)
    Menu.setApplicationMenu(null)
    const codeCachePath = getCodeCachePath()

    // let clientLanguage = undefined
    // if ("getPerferredSystemLanguages" in app) {
    //     clientLanguage = app.getPerferredSystemLanguages()?.[0] ??'cn'
    // }

    app.whenReady().then(() => {
        onReady()
    })

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit()
        }
    })

    function getUserDataPath() {
        return product["rootDir"]
    }

    function getCodeCachePath() {
        const commit = product.commit
        if (!commit) {
            return undefined
        }
        return path.join(userDataPath, "CacheData", commit)
    }
    function startUp(cachePath?: string, config?: any) {
        require("./client/client")
    }
    async function onReady() {
        startUp()
    }
}
