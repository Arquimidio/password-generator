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

    shouldApplyCallback(colName){
        return colName in this.applyCb
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

    addToDataset(row, colName, colValue){
        row.dataset[colName] = colValue 
    }

    createCol(content){
        const td = document.createElement('td')
        td.innerText = content
        return td
    }

    showColumn(curRow, colName, colValue){
        if(this.shouldShowCol(colName)){
            if(this.shouldApplyCallback(colName)){
                colValue = this.applyCb[colName].call(this, colValue)
            }

            const column = this.createCol(colValue)

            if(this.shouldApplyCallback('allCols')){
                column.addEventListener(
                    'click',
                    this.applyCb['allCols'].bind(this, colValue) 
                )
            }
            curRow.append(column)
        }
    }

    makeSingleColumn(curRow){
        return function(colData){
            let [colName, colValue] = colData
            this.shouldPopulate() && this.addToDataset(curRow, colName, colValue)
            this.showColumn(curRow, colName, colValue)
        }
    }

    makeColumns(row, columns){
        columns.forEach(this.makeSingleColumn(row).bind(this))
    }

    createRow(){
        const tr = document.createElement('tr')
        tr.className = this.trClass
        return tr
    }

    applyCallbackToRow(row){
        row.addEventListener('click', (event) => {
            this.applyCb['tr'].bind(this, event)()
            this.selectTR(event)
        })
    }

    makeSingleRow(item){
        const tr = this.createRow()
        const columns = Object.entries(item)
        this.shouldOrder() && this.orderColumns(columns)
        this.shouldApplyCallback('tr') && this.applyCallbackToRow(tr)
        this.makeColumns(tr, columns)
        this.tbody.append(tr)
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

    filterByDate(date1, date2){
        this.filteredData = this.data.filter(item => {
            const itemDate = new Date(item.data_entrada)
            return date1 <= itemDate && itemDate <= date2
        })
        this.append(this.filteredData, true)
    }

    selectTR(event){
        const anteriormenteSelecionado = this.tbody.querySelector('.linha-selecionada')
        if(anteriormenteSelecionado){
          anteriormenteSelecionado.classList.remove('linha-selecionada')
        }
        event.currentTarget.classList.add('linha-selecionada')
    }
}

module.exports = Table