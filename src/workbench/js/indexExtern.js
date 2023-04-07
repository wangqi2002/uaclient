const { ipcRenderer } = require('electron')

function mainMini(){
    ipcRenderer.send('main:min')
}

function mainMax(){
    ipcRenderer.send('main:max')
}

function mainClose(){
    ipcRenderer.send('main:close')
}
