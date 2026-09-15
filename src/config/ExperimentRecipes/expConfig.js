export default [
    {
        key: 1,
        title: 'CVD 化學氣相沉積',
        params: [
            {
                name: '基板尺寸 (cm x cm)',
                params: 'size',
                type: String
            },
            {
                name: 'MoO3 (g)',
                params: 'Mo_content',
                type: Number
            },
            {
                name: 'S (g)',
                params: 'S_content',
                type: Number
            },
            {
                name: '擺片（犧牲 : 一般）',
                params: 'position_ratio',
                type: String
            },
            {
                name: '加熱包/爐管距離 (cm)',
                params: 'heater_tube_distance',
                type: Number
            },
            {
                name: 'Ar Purge (sccm, min)',
                params: 'Ar_purge_params',
                type: String
            },
            {
                name: 'Experiment Parameters (sccm, torr)',
                params: 'exp_env_params',
                type: String
            },
            {
                name: '升溫目標 (TSP1)',
                params: 'TSP1',
                type: Number
            },
            {
                name: '升溫速率 (RMP1)',
                params: 'RMP1',
                type: Number
            },
            {
                name: '材料成長 (Temp, min)',
                params: 'exp_growth_params',
                type: String
            }
        ]
    },
    {
        key: 2,
        title: 'PVD 物理氣相沉積',
        params: [
            {
                name: '基板尺寸 (cm x cm)',
                params: 'size',
                type: String
            },
            {
                name: 'MoO3 (g)',
                params: 'Mo_content',
                type: Number
            },
            {
                name: 'S (g)',
                params: 'S_content',
                type: Number
            },
            {
                name: '擺片（犧牲 : 一般）',
                params: 'position_ratio',
                type: String
            },
            {
                name: '加熱包/爐管距離 (cm)',
                params: 'heater_tube_distance',
                type: String
            },
            {
                name: 'Ar Purge (sccm, min)',
                params: 'Ar_purge_params',
                type: String
            },
            {
                name: 'Experiment Parameters (sccm, torr)',
                params: 'exp_env_params',
                type: String
            },
            {
                name: '升溫目標 (TSP1)',
                params: 'TSP1',
                type: Number
            },
            {
                name: '升溫速率 (RMP1)',
                params: 'RMP1',
                type: Number
            },
            {
                name: '材料成長 (Temp, min)',
                params: 'exp_growth_params',
                type: String
            }
        ]
    }
]