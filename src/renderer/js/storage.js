const Table = require('../js/Table')
let table
window.addEventListener('DOMContentLoaded', () => {
    table = new Table({
        id: 'table-wrapper',
        headings: ['Site', 'Login', 'Password'],
        data: []
    })
})