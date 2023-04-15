const { ipcRenderer } = require('electron')

function mainMini() {
    ipcRenderer.send('render:bench.mini')
}

function mainMax() {
    ipcRenderer.send('render:bench.max')
}
function mainClose() {
    ipcRenderer.send('render:bench.close')
}
