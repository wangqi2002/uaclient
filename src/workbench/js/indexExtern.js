const {ipcRenderer} = require('electron')

function mainMini() {
    ipcRenderer.send('render:bench.mini')
}

function mainMax() {
    ipcRenderer.send('render:bench.max')
}

function mainClose() {
    ipcRenderer.send('render:bench.close')
}

function subscript() {
    ipcRenderer.on('pipe:ua.pushed', (a, data) => {
        console.log(data, 'client')
    })
}
