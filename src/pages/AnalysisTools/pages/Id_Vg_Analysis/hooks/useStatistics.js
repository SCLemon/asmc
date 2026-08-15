
// SS (mV/decade)
function calculateSubthresholdSwing(data, normalized_factor) {
    
}

// Effective Mobility (y-function)
function calculateEffectiveMobility(data, normalized_factor){

}

// Ion (uA)
function calculateIon(data, normalized_factor) {
    return ((Math.max(...data.y) / normalized_factor) * 1e6)
}

// Ioff (uA)
function calculateIoff(data, normalized_factor, vgOff) {

    const { x, y } = data

    const exactIndex = x.findIndex(v => v === vgOff)
    if (exactIndex !== -1) {
        return y[exactIndex] / normalized_factor
    }

    // 內插法
    for (let i = 0; i < x.length - 1; i++) {

        const x1 = x[i]
        const x2 = x[i + 1]

        if ((x1 <= vgOff && vgOff <= x2) || (x2 <= vgOff && vgOff <= x1)) {

            const y1 = y[i]
            const y2 = y[i + 1]

            // 線性內插
            const interpolatedY =  y1 + (y2 - y1) * (vgOff - x1) / (x2 - x1)

            return interpolatedY / normalized_factor
        }
    }

    return null
}

// Vth
function calculateVth(data, normalized_factor, iVth) {

    const { x, y } = data

    // normalize Id
    const normalizedY = y.map(current => current / normalized_factor)

    const targetCurrent = iVth

    const exactIndex = normalizedY.findIndex(current => current === targetCurrent)
    if (exactIndex !== -1) return x[exactIndex]

    // 內插法
    for (let i = 0; i < normalizedY.length - 1; i++) {

        const y1 = normalizedY[i]
        const y2 = normalizedY[i + 1]

        if ((y1 <= targetCurrent && targetCurrent <= y2) || (y2 <= targetCurrent && targetCurrent <= y1)) {

            if (y1 <= 0 || y2 <= 0) {
                return null
            }

            // log(Id) 線性內插
            const logY1 = Math.log10(y1)
            const logY2 = Math.log10(y2)
            const logTarget = Math.log10(targetCurrent)

            const ratio = (logTarget - logY1) / (logY2 - logY1)

            return x[i] + ratio * (x[i + 1] - x[i])

        }
    }

    return null
}


export function useStatistics(data, normalized_factor, vgOff, iVth) {

    const result = {}

    Object.entries(data).forEach(([groupName, group]) => {

        result[groupName] = {
            Ion: calculateIon(group.increase, normalized_factor),
            Ioff: calculateIoff(group.increase, normalized_factor,vgOff),
            Vth: calculateVth(group.increase, normalized_factor, iVth),
        }

        result[`${groupName} (rev)`] = {
            Ion: calculateIon(group.decrease, normalized_factor),
            Ioff: calculateIoff(group.decrease, normalized_factor, vgOff),
            Vth: calculateVth(group.decrease, normalized_factor, iVth),
        }

    })

    return result
}