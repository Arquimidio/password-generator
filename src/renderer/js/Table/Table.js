const Row = require('./Row')
const Column = require('./Column')

class Table{
    constructor({ 
        id, 
        data=[], 
        headings, 
        applyCb={}, 
        trClass="", 
        populateDataset=false,
        exclude={},
        order=[]
}   ){
        this.wrapperId = id
        this.data = data
        this.filteredData = this.data
        this.order = order
        this.applyCb = applyCb
        this.exclude = exclude
        this.populateDataset = populateDataset
        this.trClass = trClass
        this.headings = headings
        this.load()
    }

    initializeElements(){
        this.wrapper = document.getElementById(this.wrapperId)
        this.table = document.createElement('table')
        this.thead = document.createElement('thead')
        this.headRow = document.createElement('tr')
        this.tbody = document.createElement('tbody')
    }

    loadSingleHeading(heading){
        const th = document.createElement('th')
        th.innerText = heading
        this.headRow.append(th)
    }

    loadHeadings(){
        this.headings.forEach(this.loadSingleHeading.bind(this))
    }

    loadHeader(){
        this.thead.append(this.headRow)
    }

    loadTable(){
        this.table.append(this.thead, this.tbody)
        this.wrapper.append(this.table)
    }

    loadInitialContent(){
        this.append(this.data)
    }

    /* Makes the initial loading of the table */
    load(){
        this.initializeElements()
        this.loadHeader()
        this.loadHeadings()
        this.loadTable()
        this.loadInitialContent()
    }

    hasData(){
        return !!this.data
    }

    shouldOrder(){
        return this.order.length !== 0
    }

    shouldShowCol(colName){
        return !(colName in this.exclude)
    }

    shouldPopulate(){
        return this.populateDataset
    }

    orderColumns(columnsArray){
        columnsArray.sort((a, b) => {
            const [nameA] = a
            const [nameB] = b
            const iA = this.order.indexOf(nameA)
            const iB = this.order.indexOf(nameB)
            return iA - iB
        })
    }

    makeSingleColumn(parentRow){
        return function(colData){
            let [colName, colValue] = colData

            new Column({
                parentRow,
                colName,
                colValue,
                shouldPopulateRow: this.shouldPopulate(),
                shouldShow: this.shouldShowCol(colName),
                valueCallback: this.applyCb[colName],
                listenerCallback: this.applyCb['allCols']
            })
        }
    }

    makeColumns(row, columns){
        columns.forEach(this.makeSingleColumn(row).bind(this))
    }

    makeSingleRow(item){
        const row = new Row({
            container: this.tbody,
            listenerCallback: this.applyCb['tr']
        }).element
        const columns = Object.entries(item)
        this.shouldOrder() && this.orderColumns(columns)
        this.makeColumns(row, columns)
    }

    makeRows(rows){
        rows.forEach(this.makeSingleRow.bind(this))
    }

    append(data=[]){
        this.deleteContent()
        if(!this.hasData()) this.data = data
        this.makeRows(data)
    }

    insert(data){
        this.makeRows(data)
    }

    deleteContent(){
        this.tbody.innerHTML = ''
    }

    delete(){
        this.wrapper.innerHTML = ''
    }

    filtrarPor(fn){
        this.filteredData = this.data.filter(fn)
        this.append(this.filteredData, true)
    }
}

module.exports = Table