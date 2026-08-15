let rawData = [];
let parseData = [];
let grouppedData = {};

// 初始化資料
function parseDataToNumberAndRemoveHeader(data) {
    const rows = data.trim().split('\n').slice(1).map(row => row.split(',')).map((row,id)=>{
        return [
            Number.parseFloat(row[0]),
            Number.parseFloat(row[1]),
            Number.parseFloat(row[2]),
            Number.parseFloat(row[3])
        ]
    })
    return rows;
}


// 轉換成 x,y 格式
function toXY(data) {
    return {
        x: data.map(row => row[0]),
        y: data.map(row => row[1]),
    }
}

// 資料分群 & 後續統計用
function groupData(data) {
    // 分群
    const groups = data.reduce((obj, row) => {
        const key = row[3]

        if (!obj[key]) obj[key] = []

        obj[key].push(row)

        return obj
    }, {})

    const result = {}

    // 拆分為正向與反向兩組數據
    Object.entries(groups).forEach(([key, group]) => {
        
        let increase = []
        let decrease = []

        let lastDir = 0

        for (let i = 0; i < group.length - 1; i++) {
            const curr = group[i]
            const next = group[i + 1]

            const dir = Math.sign(next[0] - curr[0])

            if (dir >= 0) {
                increase.push(curr)
            } else {
                decrease.push(curr)
            }

            lastDir = dir
        }

        
        if (lastDir >= 0) increase.push(group.at(-1))
        else decrease.push(group.at(-1))

        increase = increase.sort((a, b) => a[0] - b[0]);
        decrease = decrease.sort((a, b) => b[0] - a[0]);

        // 轉換為 x,y 格式
        result[key+`V`] = {
            increase: toXY(increase),
            decrease: toXY(decrease)
        }
    })
    return result;
}


// 繪圖用
function getColor(index, total, type) {

    const ratio = index / Math.max(total - 1, 1)

    if (type === 'increase') {
        // 深藍 → 淺藍
        const lightness = 25 + ratio * 50
        return `hsl(215, 85%, ${lightness}%)`
    }

    // 深橘 → 淺橘
    const lightness = 25 + ratio * 50
    return `hsl(25, 90%, ${lightness}%)`
}

function extractData(type, yAxisType, config, range, normalized_factor) {

    const groups = Object.entries(grouppedData)

    const selectedGroups = range?.length
        ? groups.filter((_, index) => range.includes(index + 1))
        : groups

    const output = []

    selectedGroups.forEach(([groupName, group], index) => {

        const increaseColor = getColor(index, selectedGroups.length, 'increase')
        const decreaseColor = getColor(index, selectedGroups.length, 'decrease')


        // Increase
        if (type == 0 || type == 1) {

            const y = group.increase.y.map(v => v / normalized_factor)

            // Log axis
            if (yAxisType == 0 || yAxisType == 1) {
                output.push({
                    x: group.increase.x,
                    y: y,
                    yaxis: 'y',
                    name: `Vd = ${groupName}`,
                    ...config.increase,
                    line: {
                        ...config.increase.line,
                        color: increaseColor
                    }
                })
            }


            // Linear μA axis
            if (yAxisType == 0 || yAxisType == 2) {
            output.push({
                    x: group.increase.x,
                    y: y.map(v => v * 1e6),
                    yaxis: 'y2',
                    name: `Vd = ${groupName}`,
                    showlegend: (yAxisType == 2),
                    ...config.increase,
                    line: {
                        ...config.increase.line,
                        color: increaseColor
                    }
                })
            }
        }

        // Decrease
        if (type == 0 || type == 2) {

            const y = group.decrease.y.map(v => v / normalized_factor)

            // Log axis
            if (yAxisType == 0 || yAxisType == 1) {
                output.push({
                    x: group.decrease.x,
                    y: y,
                    yaxis: 'y',
                    name: `Vd = ${groupName} (rev)`,
                    ...config.decrease,
                    line: {
                        ...config.decrease.line,
                        color: decreaseColor
                    }
                })
            }

            // Linear μA axis
            if (yAxisType == 0 || yAxisType == 2) {
                output.push({
                    x: group.decrease.x,
                    y: y.map(v => v * 1e6),
                    yaxis: 'y2',
                    name: `Vd = ${groupName} (rev)`,
                    showlegend: (yAxisType == 2),
                    ...config.decrease,
                    line: {
                        ...config.decrease.line,
                        color: decreaseColor
                    }
                })
            }
        }
    })

    return output
}


export async function useHandleData(file){

    rawData = await file.text();
    parseData = parseDataToNumberAndRemoveHeader(rawData);
    grouppedData = groupData(parseData);
    
    return {
        extractData, grouppedData
    }
}

