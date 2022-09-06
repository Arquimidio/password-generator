const { ipcRenderer, clipboard } = require('electron')
const StoreItem = require('../js/StoreItem')
const Table = require('../js/Table/Table')
const accountForm = document.getElementById('account-form')
let table

ipcRenderer.on('get-passwords', (event, data) => {
    table = new Table({
        id: 'table-wrapper',
        headings: ['Site', 'Login', 'Password'],
        applyCb: {
            allCols: (colValue) => console.log(colValue)
        },
        data
    })
})

accountForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(accountForm)
    const allInputs = formData.getAll('account')
    const storeItem = new StoreItem(...allInputs)
    ipcRenderer.send('password-store', storeItem)
})



