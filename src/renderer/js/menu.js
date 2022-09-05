const { ipcRenderer } = require('electron')

function minimizeApp(){
    ipcRenderer.send('app-minimize')
}

function closeApp(){
    ipcRenderer.send('app-close')
}

module.exports = [
    minimizeApp,
    closeApp
]

