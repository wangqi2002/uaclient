const { ipcRenderer } = require('electron')

// export let RendererEvents = {
//     //main
//     mainMini: 'main:mini',
//     mainMax: 'main:max',
//     mainClose: 'main:close',
//     mainMenu: 'main:menu',
// }
console.log('preload')
setTimeout(async () => {
    console.log(await ipcRenderer.invoke('folder:open', 'F:\\idea_projects\\uaclient\\src\\client'))
}, 1000)
window.addEventListener('DOMContentLoaded', () => {
    window.ipcRenderer = ipcRenderer
    // const minimizeButton = document.getElementById("minimize-btn");
    // const maxButton = document.getElementById("max-max-btn");
    // const closeButton = document.getElementById("close-btn");
    // const menuButton = document.getElementById("menu-btn");
    //
    // menuButton?.addEventListener("click", e => {
    //     ipcRenderer.send(RendererEvents.mainMenu)
    // })
    // minimizeButton?.addEventListener("click", e => {
    //     ipcRenderer.send(RendererEvents.mainMini)
    // })
    // closeButton?.addEventListener("click", e => {
    //     ipcRenderer.send(RendererEvents.mainClose)
    // })
    // maxButton?.addEventListener('click', ev => {
    //     ipcRenderer.send(RendererEvents.mainMax)
    // })
})
