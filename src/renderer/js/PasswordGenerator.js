module.exports = class PasswordGenerator{
    constructor({
        uppercase = false,
        lowercase = false,
        symbols = false,
        numbers = false,
        desiredLength = 12
    }){
        this.charRanges = {
            uppercase: [65, 90],
            lowercase: [97, 122],
            symbols: [35, 38],
            numbers: [48, 57]            
        }

        this.desiredLength = desiredLength
        this.uppercase = uppercase
        this.lowercase = lowercase
        this.symbols = symbols
        this.numbers = numbers
    }

    shuffle(arr){
        for(let i = arr.length - 1; i > 0; i--){
            let j = Math.floor(Math.random() * i);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        return arr     
    }

    randomInRange(min, max){
        return Math.floor(Math.random() * (max + 1 - min) + min)
    }

    getShuffledAllowed(){
        const allowed = Object.keys(this).filter(entry => this[entry] === true)
        return this.shuffle(allowed)
    }

    generate(){
        let password = []
        const shuffledAllowed = this.getShuffledAllowed()
        let count = 0
        while(password.length < this.desiredLength){
            const curPreference = shuffledAllowed[count % shuffledAllowed.length]
            const [min, max] = 
                this.charRanges[curPreference]
            const randCharCode = this.randomInRange(min, max)
            password.push(String.fromCharCode(randCharCode))
            count++
        }
        return this.shuffle(password).join('')
    }
}

