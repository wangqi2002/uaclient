const { ipcRenderer } = require('electron')
// function los() {
//     ipcRenderer.send('main:max')
//     console.log('222')
// }

function mainMini(){
    ipcRenderer.send('main:min')
}

function mainMax(){
    ipcRenderer.send('main:max')
}

function mainClose(){
    ipcRenderer.send('main:close')
}
