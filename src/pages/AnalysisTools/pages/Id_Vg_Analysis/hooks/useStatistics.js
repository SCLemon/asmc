
// SS (mV/decade) - 支援 n-type 與 p-type
function calculateSubthresholdSwing(data) {
    const { x, y } = data;
    const points = x.map((vg, i) => ({ vg, logId: y[i] > 0 ? Math.log10(y[i]) : null })).filter(p => p.logId !== null);
    const windowSize = 5;
    let bestSS = Infinity;
    let bestR2 = -Infinity;

    for (let i = 0; i <= points.length - windowSize; i++) {
        const window = points.slice(i, i + windowSize);
        const n = window.length;
        const sumX = window.reduce((s, p) => s + p.vg, 0);
        const sumY = window.reduce((s, p) => s + p.logId, 0);
        const sumXY = window.reduce((s, p) => s + p.vg * p.logId, 0);
        const sumX2 = window.reduce((s, p) => s + p.vg ** 2, 0);
        const denominator = n * sumX2 - sumX ** 2;
        if (denominator === 0) continue;

        const slope = (n * sumXY - sumX * sumY) / denominator;
        const absSlope = Math.abs(slope);
        if (absSlope === 0) continue;

        const intercept = (sumY - slope * sumX) / n;
        const meanY = sumY / n;
        const ssTot = window.reduce((s, p) => s + (p.logId - meanY) ** 2, 0);
        const ssRes = window.reduce((s, p) => s + (p.logId - (slope * p.vg + intercept)) ** 2, 0);
        if (ssTot === 0) continue;

        const r2 = 1 - ssRes / ssTot;
        const ss = 1000 / absSlope;

        if (r2 >= 0.95 && ss < bestSS) {
            bestSS = ss;
            bestR2 = r2;
        }
    }

    return bestSS === Infinity ? null : bestSS;
}

// Field Effect Effective Mobility
function calculateEffectiveMobility(data, vd, width, length, εr, thickness) {
    const { x, y } = data;
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
            Mobility: calculateEffectiveMobility(group.increase, groupName, width, length, εr, thickness),
            SS: calculateSubthresholdSwing(group.increase)
        }

        result[`${groupName} (rev)`] = {
            Ion: calculateIon(group.decrease, width),
            Ioff: calculateIoff(group.decrease, width),
            Vth: calculateVth(group.decrease, width, iVth),
            Mobility: calculateEffectiveMobility(group.decrease, groupName, width, length, εr, thickness),
            SS: calculateSubthresholdSwing(group.decrease)
        }

    })

    return result
}