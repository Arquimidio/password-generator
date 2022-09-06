const { ipcRenderer } = require('electron')
const menu = require('./src/renderer/js/menu')
const { 
    moveRangeLeftColor
} = require('./src/renderer/js/helpers')



window.addEventListener('DOMContentLoaded', () => {
    const range = document.querySelector('input[type=range]')
    const gotoStorage = document.querySelector('.storage-btn')
    const gotoPass = document.querySelector('.pass-btn')
    const gotoSettings = document.querySelector('.settings-btn')

    if(range){
        range.addEventListener('input', moveRangeLeftColor)
    }

    //document.documentElement.setAttribute('data-theme', 'light')
    gotoStorage.addEventListener('click', () => ipcRenderer.send('goto-storage'))
    gotoPass.addEventListener('click', () => ipcRenderer.send('goto-pass'))
    gotoSettings.addEventListener('click', () => ipcRenderer.send('goto-settings'))

    const navbarWindowButtons = document.querySelector('.navbar-buttons').children
    menu.forEach((menuFunction, i) => {
        navbarWindowButtons[i].addEventListener('click', menuFunction)
    })
})