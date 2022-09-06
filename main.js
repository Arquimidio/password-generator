const { app, ipcMain, BrowserWindow } = require('electron')
const path = require('path')
const Store = require('electron-store')
const store = new Store()
const DataSender = require('./src/renderer/js/DataSender')
const WINDOW_WIDTH = 400
const WINDOW_HEIGHT = 515

const MAIN_PATH = './src/renderer/pages/passGen.html'
const STORAGE_PATH = './src/renderer/pages/storage.html'
const SETTINGS_PATH = './src/renderer/pages/settings.html'
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

function storePassword(event, data){
    const { passwords } = store.store
    store.set('passwords', [...passwords, data])
    win.reload()
}

function storePreference(event, data){
    const [id, preference] = data
    store.set(`config.${id}`, preference)
}

function storeLength(event, length){
    store.set('config.desiredLength', Number(length))
}

function getStoredPreferences(){
    win.webContents.send(
        'receive-preferences',
        store.get('config')
    )
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
    win.on('ready-to-show', () => {
        switch(win.curPath){
            case STORAGE_PATH:
                sendData(getPasswords)
                break;
        }
        win.show()
    })
    win.curPath = MAIN_PATH
    win.loadFile(MAIN_PATH)
}

app.on('ready', () => {
    createWindow()
})

function sendData(callback){
    const { event, data } = callback()
    win.webContents.send(event, data)
}

function changeWindow(path, data = null){
    return () => {
        if(path !== win.curPath){
            win.loadFile(path)
            win.curPath = path
        }
    } 
}

function getPasswords(){
    const data = store.get('passwords')
    return new DataSender('get-passwords', data)
}

ipcMain.on('app-close', () => app.quit())
ipcMain.on('app-minimize', () => win.minimize())
ipcMain.on('goto-storage', changeWindow(STORAGE_PATH))
ipcMain.on('goto-pass', changeWindow(MAIN_PATH))
ipcMain.on('goto-settings', changeWindow(SETTINGS_PATH))
ipcMain.on('password-store', storePassword)
ipcMain.on('toggle-preference', storePreference)
ipcMain.on('get-preferences', getStoredPreferences)
ipcMain.on('change-length', storeLength)