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

// 資料分群
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


// 汲取輸出資料 -- type 0: All, type 1: increase, type 2: decrease
function extractData(type, config, range) {

    const groups = Object.entries(grouppedData)

    const selectedGroups = range?.length ? groups.filter((_, index) => range.includes(index + 1)) : groups

    const output = [];

    selectedGroups.forEach(([groupName, group]) => {

        // increase
        if(type == 0 || type == 1) {
            output.push({
                x: group.increase.x,
                y: group.increase.y,
                name: `Vg = ${groupName}`,
                ...config.increase
            })
        }

        // decrease
        if(type == 0 || type == 2){
            output.push({
                x: group.decrease.x,
                y: group.decrease.y,
                name: `Vg = ${groupName} (rev)`,
                ...config.decrease
            })
        }
    })

    return output
}


export async function useHandleData(src){

    rawData = await (await fetch(src)).text();
    parseData = parseDataToNumberAndRemoveHeader(rawData);
    grouppedData = groupData(parseData);

    
    return {
        extractData
    }
}

