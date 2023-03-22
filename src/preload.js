"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RendererEvents = void 0;
const { ipcRenderer } = require("electron");
var RendererEvents;
(function (RendererEvents) {
    //main
    RendererEvents["mainMini"] = "main:mini";
    RendererEvents["mainMax"] = "main:max";
    RendererEvents["mainClose"] = "main:close";
    RendererEvents["mainMenu"] = "main:menu";
})(RendererEvents = exports.RendererEvents || (exports.RendererEvents = {}));
window.addEventListener("DOMContentLoaded", () => {
    const minimizeButton = document.getElementById("minimize-btn");
    const maxButton = document.getElementById("max-unmax-btn");
    const closeButton = document.getElementById("close-btn");
    const menuButton = document.getElementById("menu-btn");
    menuButton === null || menuButton === void 0 ? void 0 : menuButton.addEventListener("click", e => {
        ipcRenderer.send(RendererEvents.mainMenu);
    });
    minimizeButton === null || minimizeButton === void 0 ? void 0 : minimizeButton.addEventListener("click", e => {
        ipcRenderer.send(RendererEvents.mainMini);
    });
    closeButton === null || closeButton === void 0 ? void 0 : closeButton.addEventListener("click", e => {
        ipcRenderer.send(RendererEvents.mainClose);
    });
    maxButton === null || maxButton === void 0 ? void 0 : maxButton.addEventListener('click', ev => {
        ipcRenderer.send(RendererEvents.mainMax);
    });
});
