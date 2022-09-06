module.exports = class Column{
  constructor({
    parentRow,
    shouldPopulateRow = false,
    valueCallback = null,
    listenerCallback = null,
    colName,
    colValue,
    shouldShow = true
  }){
    this.element = document.createElement('td')
    this.parentRow = parentRow
    this.colName = colName
    this.colValue = colValue
    this.valueCallback = valueCallback
    this.listenerCallback = listenerCallback
    this.shouldPopulateRow = shouldPopulateRow
    this.shouldShow = shouldShow
    this.create()
  }

  addValueCallback(){
    if(this.valueCallback){
      this.colValue = this.valueCallback.call(this, this.colValue)
    }
  }

  addListenerCallback(){
    if(this.listenerCallback){
      this.element.addEventListener(
        'click',
        this.listenerCallback.bind(this, this.colValue) 
      )
    }
  }

  populateRow(){
    if(this.shouldPopulateRow){
      this.parentRow.dataset[this.colName] = this.colValue
    }
  }

  addValueAsText(){
    this.element.innerText = this.colValue
  }

  render(){
    this.parentRow.append(this.element)
  }

  create(){
    if(this.shouldShow){
      this.addListenerCallback()
      this.addValueAsText()
      this.render()
    }
    this.addValueCallback()
    this.populateRow()
  }
}