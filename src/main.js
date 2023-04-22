const { app, Menu, ipcRenderer, ipcMain } = require('electron')
const path = require('path')
require('v8-compile-cache')
const product = require('./client/product.json')
const { FileUtils } = require('./platform/base/utils/utils')

const userDataPath = getUserDataPath()

const workspacePath = app.setPath('appData', userDataPath)
Menu.setApplicationMenu(null)
const codeCachePath = getCodeCachePath()

// let clientLanguage = undefined
// if ("getPerferredSystemLanguages" in app) {
//     clientLanguage = app.getPerferredSystemLanguages()?.[0] ??'cn'
// }
app.whenReady().then(() => {
    onReady()
})

function startUp(cachePath, workspacePath, appDataPath, config) {
    require('./client/client')
}

async function onReady() {
    startUp()
    // setTimeout(async () => {
    //     ipcMain.handle('folder:open', async (event, fileName) => {
    //         let files = FileUtils.openFolder(fileName)
    //         console.log(files)
    //         if (files.includes('project.json')) {
    //             ipcClient.emit('project:load', fileName, files)
    //             return null
    //         } else {
    //             return files
    //         }
    //     })
    //     console.log(await ipcRenderer.invoke('folder:open', 'F:\\idea_projects\\uaclient\\src\\client'))
    // }, 10000)
}

function getUserDataPath() {
    let path = product['appData']
    if (!path) {
        path = app.getPath('appData')
    }
    return path
}

function getCodeCachePath() {
    const commit = product.commit
    if (!commit) {
        return undefined
    }
    return path.join(userDataPath, 'CacheData', commit)
}

// export function createPKI() {
//     let exec = require("child_process").exec
//     exec("npx node-opcua-pki createPKI")
// }
//todo 项目实现,手动输入命令实现,electron-squirrel-startup处理安装问题,处理全局路径问题,主进程中实现html页面的加载,插件加载问题
//todo 全局监听报错
