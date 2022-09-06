module.exports = class Row{
  constructor({
    listenerCallback = null,
    container
  }){
    this.container = container
    this.element = document.createElement('tr')
    this.listenerCallback = listenerCallback
    this.create()
  }

  selectRow(event){
    const previouslySelected = this.container.querySelector('.linha-selecionada')
    if(previouslySelected){
      previouslySelected.classList.remove('linha-selecionada')
    }
    event.currentTarget.classList.add('linha-selecionada')
  }

  addCallback(){
    if(this.listenerCallback){
      this.element.addEventListener('click', (event) => {
        this.listenerCallback.bind(this, event)()
        this.selectRow(event)  
      })
    }
  }

  create(){
    this.addCallback()
    this.container.append(this.element)
  }
}