
// SS (mV/decade)
function calculateSubthresholdSwing(data, width) {
    
}

// Field Effect Effective Mobility
function calculateEffectiveMobility(data, vd, width, length, εr, thickness) {
    const { x, y } = data;
    console.log(parseInt(vd))
    const ε0 = 8.854*1e-14
    const cox = (ε0 * εr) / (thickness * 1e-7); // F/cm^2

    let maxDydx = -Infinity;

    for (let i = 1; i < x.length - 1; i++) {
        // dy / dx
        const dydx = (y[i + 1] - y[i - 1]) / (x[i + 1] - x[i - 1]);
        if (dydx > maxDydx) {
            maxDydx = dydx;
        }
    }

    const mobility = maxDydx * (length / width) * (1 / cox) / parseInt(vd);

    return mobility;
}

// Ion (uA)
function calculateIon(data, width) {
    return ((Math.max(...data.y) / width) * 1e6)
}

// Ioff (uA)
function calculateIoff(data, width) {
    return ((Math.min(...data.y) / width) * 1e6)
}

// Vth
function calculateVth(data, width, iVth) {

    const { x, y } = data

    // normalize Id
    const normalizedY = y.map(current => current / width)

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


export function useStatistics(data, width, length, εr, thickness, iVth) {
    const result = {}

    Object.entries(data).forEach(([groupName, group]) => {

        result[groupName] = {
            Ion: calculateIon(group.increase, width),
            Ioff: calculateIoff(group.increase, width),
            Vth: calculateVth(group.increase, width, iVth),
            Mobility: calculateEffectiveMobility(group.increase, groupName, width, length, εr, thickness)
        }

        result[`${groupName} (rev)`] = {
            Ion: calculateIon(group.decrease, width),
            Ioff: calculateIoff(group.decrease, width),
            Vth: calculateVth(group.decrease, width, iVth),
            Mobility: calculateEffectiveMobility(group.decrease, groupName, width, length, εr, thickness)
        }

    })

    return result
}