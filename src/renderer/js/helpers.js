function changeProgressGradient(target, percentage){
    const gradient = `var(--accent) ${percentage}%, var(--slider-empty) ${percentage}%`
    target.style.background = 
        `linear-gradient(to right, ${gradient})`
}

function getProgressPercentage(target){
    const { value, max, min } = target
    const percentage = (value - min) / (max - min) * 100
    return percentage
}

function moveRangeLeftColor(event){
    let target = event.target? event.target : event
    const percentage = getProgressPercentage(target)
    changeProgressGradient(target, percentage)
}

module.exports = {
    changeProgressGradient,
    getProgressPercentage,
    moveRangeLeftColor
}