import { ref } from 'vue'


// function readCsv(event) {
//   const file = event.target.files[0]
//   if (!file) return

//   const reader = new FileReader()

//   reader.onload = (e) => {
//     const text = e.target.result
//     console.log(text)
//   }

//   reader.readAsText(file)
// }

async function readCsv(src){
    return await (await fetch(src)).text();
}

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
function formatData(data) {

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
        result[key] = {
            increase: toXY(increase),
            decrease: toXY(decrease)
        }
    })

    return result
}


export async function useHandleData(src){

    const data = await readCsv(src);
    const parseData = parseDataToNumberAndRemoveHeader(data);
    const formattedData = formatData(parseData);
    
    return formattedData
}