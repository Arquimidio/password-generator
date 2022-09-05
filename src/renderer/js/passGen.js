const PasswordGenerator = require('../js/PasswordGenerator')
const { 
    moveRangeLeftColor
} = require('../js/helpers')
let passGenerator
const { passwordStrength } = require('check-password-strength') 
const { ipcRenderer, clipboard } = require('electron')
const lengthValue = document.querySelector('.length')
const lengthControl = document.querySelector('.length-control')
const checkboxes = [...document.querySelectorAll('.preference')]
const generateBtn = document.querySelector('.generate-btn')
const passwordDisplay = document.querySelector('.generated-password-text')
const strengthClassification = document.querySelector('.strength-classification')
const bars = [...document.getElementsByClassName('bar')]
const copyToClipboard = document.getElementById('copy-to-clipboard')

const STRENGTH_COLORS = ['--too-weak', '--weak', '--medium', '--strong']

function allPreferencesDisabled(){
    return checkboxes.every(checkbox => checkbox.checked === false)
}

function disableGeneration(){
    generateBtn.disabled = true
}

function enablegeneration(){
    generateBtn.disabled = false
}

function toggleGeneration(){
    console.log(allPreferencesDisabled())
    if(allPreferencesDisabled()){
        disableGeneration()
    }else{
        enablegeneration()
    }
}

function togglePreference(event){
    const { id } = event.target
    passGenerator[id] = !passGenerator[id]
    toggleGeneration()
    ipcRenderer.send('toggle-preference', [id, passGenerator[id]])
}

function changeLength(event){
    const { value } = event.target
    passGenerator.desiredLength = Number(value)
    lengthValue.innerText = value
    ipcRenderer.send('change-length', value)
}

function oneCharKindIsSelected(){
    return [...checkboxes].some(checkbox => checkbox.checked)
}

function resetBarColors(){
    bars.forEach(bar => bar.style.backgroundColor = 'transparent')
}

function changeBarColors(classification){
    resetBarColors()
    for(let i = 0; i < classification.id + 1; i++){
        bars[i].style.backgroundColor = `var(${STRENGTH_COLORS[classification.id]})`
    }
}

function generatePassword(){
    if(oneCharKindIsSelected()){
        copyToClipboard.style.display = 'block'
        const password = passGenerator.generate.call(passGenerator)
        const classification = passwordStrength(password)
        strengthClassification.innerText = classification.value
        changeBarColors(classification)
        passwordDisplay.innerText = password
    }else{
        passwordDisplay.innerText = 'SELECT A PREFERENCE'
    }
}

function showCopyConfirmation(){
    passwordDisplay.innerText = 'Copied!'
    copyToClipboard.style.display = 'none'
}

function hideCopyConfirmation(password){
    setTimeout(() =>{
        passwordDisplay.innerText = password
        copyToClipboard.style.display = 'block'
        enablegeneration()
    }, 800)
}

function toClipboard(){
    clipboard.writeText(passwordDisplay.innerText)
    const password = passwordDisplay.innerText
    showCopyConfirmation()
    disableGeneration()
    hideCopyConfirmation(password)
}

function initializeCheckboxes(){
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('input', togglePreference)
        checkbox.checked = passGenerator[checkbox.id]
    })
}

function initializeLengthControl(){
    lengthControl.addEventListener('input', changeLength)
    lengthControl.value = passGenerator.desiredLength
    moveRangeLeftColor(lengthControl)
    lengthValue.innerHTML = lengthControl.value
}

function initializeGeneration(){
    toggleGeneration()
    generateBtn.addEventListener('click', generatePassword)
}

function initializeCopyToClipboard(){
    copyToClipboard.addEventListener('click', toClipboard)
    copyToClipboard.style.display = 'none'
}

function initializePage(event, preferences){
    passGenerator = new PasswordGenerator(preferences)
    initializeCheckboxes()
    initializeLengthControl()
    initializeGeneration()
    initializeCopyToClipboard()
}

ipcRenderer.send('get-preferences')
ipcRenderer.on('receive-preferences', initializePage)
