const {ipcRenderer} = require("electron")

export enum RendererEvents {
    //main
    mainMini = 'main:mini',
    mainMax = 'main:max',
    mainClose = 'main:close',
    mainMenu = 'main:menu',
}

window.addEventListener("DOMContentLoaded", () => {
    const minimizeButton = document.getElementById("minimize-btn");
    const maxButton = document.getElementById("max-unmax-btn");
    const closeButton = document.getElementById("close-btn");
    const menuButton = document.getElementById("menu-btn");

    menuButton?.addEventListener("click", e => {
        ipcRenderer.send(RendererEvents.mainMenu)
    })
    minimizeButton?.addEventListener("click", e => {
        ipcRenderer.send(RendererEvents.mainMini)
    })
    closeButton?.addEventListener("click", e => {
        ipcRenderer.send(RendererEvents.mainClose)
    })
    maxButton?.addEventListener('click', ev => {
        ipcRenderer.send(RendererEvents.mainMax)
    })
})
