const convertNumber = (
    number,
    params = { postfix: '', useShortVersion: false, precision: 2, keepFloat: false }
) => {
    if (number === undefined) return ''
    const { postfix, useShortVersion, precision, keepFloat } = params
    let convertedNumber = Number.parseFloat(number.toFixed(precision))
    if (postfix === 'чел.' && number === 0) return '-'
    if (number < 1 || keepFloat) {
        let i = 4
        if (keepFloat) i = precision
        if (Number.parseFloat(number.toFixed(i)) === 0 && number !== 0)
            while (Number.parseFloat(number.toFixed(i)) === 0) {
                i += 1
            }
        convertedNumber = Number.parseFloat(number.toFixed(i))
    }
    if (number > 999) {
        convertedNumber = ''
        const numberStr = Math.round(number).toString()
        let c = numberStr.length % 3
        Array.from(numberStr).forEach((n) => {
            if (c === 0) {
                c = 3
                convertedNumber += ' '
            }
            c -= 1
            convertedNumber += n
        })
        convertedNumber = convertedNumber.trim()
        if (useShortVersion) {
            const parts = convertedNumber.split(' ')
            let firstPart = parts[0]
            let secondPart = ''
            switch (parts.length) {
                case 2:
                    secondPart = ' тыс'
                    break
                case 3:
                    secondPart = ' млн'
                    break
                case 4:
                    secondPart = ' млрд'
                    break
                case 5:
                    secondPart = ' трлн'
                    break
                default:
                    firstPart = `${parts.slice(0, parts.length - 4).join(' ')}`
                    secondPart = ' трлн'
            }
            if (firstPart.length === 1 && secondPart.length > 0) {
                firstPart = (Number.parseFloat(parts[0] + parts[1]) / 1000).toFixed(1).toString()
                if (firstPart.indexOf('.0') !== -1) firstPart = firstPart.replace('.0', '')
            }
            convertedNumber = firstPart + secondPart
        }
    }
    return postfix ? `${convertedNumber.toString()} ${postfix}` : convertedNumber
}

export { convertNumber }
