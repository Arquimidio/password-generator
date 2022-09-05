const { app, ipcMain, BrowserWindow } = require('electron')
const path = require('path')
const Store = require('electron-store')
const store = new Store()
const WINDOW_WIDTH = 400
const WINDOW_HEIGHT = 515
const MAIN_PATH = './src/renderer/pages/passGen.html'
let win

if(!store.get('config')){
    store.set('passwords', [])
    store.set('config', {
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbols: false,
        desiredLength: 12,
        lastGeneratedPassword: null
    })
}


const createWindow = () => {
    win = new BrowserWindow({
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT,
        minWidth: WINDOW_WIDTH,
        minHeight: WINDOW_HEIGHT,
        maxWidth: WINDOW_WIDTH,
        maxHeight: WINDOW_HEIGHT,
        show: false,
        frame: false,
        autoHideMenuBar: true,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.on('ready-to-show', () => win.show())
    win.curPath = MAIN_PATH
    win.loadFile(MAIN_PATH)
}

app.on('ready', () => {
    createWindow()
})

function changeWindow(path){
    return () => {
        if(path !== win.curPath){
            win.loadFile(path)
            win.curPath = path
        }
    } 
}

ipcMain.on('app-close', () => app.quit())
ipcMain.on('app-minimize', () => win.minimize())
ipcMain.on('goto-storage', changeWindow('./src/renderer/pages/storage.html'))
ipcMain.on('goto-pass', changeWindow('./src/renderer/pages/passGen.html'))
ipcMain.on('password-store',  (event, data) => {
    const { passwords } = store
    passwords.push(data)
    store.set(passwords, data)
})
ipcMain.on('toggle-preference', (event, data) => {
    const [id, preference] = data
    store.set(`config.${id}`, preference)
})
ipcMain.on('get-preferences', () => {
    win.webContents.send(
        'receive-preferences',
        store.get('config')
    )
})
ipcMain.on('change-length', (event, length) => {
    store.set('config.desiredLength', Number(length))
})