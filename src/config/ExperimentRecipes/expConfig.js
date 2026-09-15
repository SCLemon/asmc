export default [
    {
        key: 1,
        title: 'CVD 化學氣相沉積',
        params: [
            {
                name: '基板尺寸 (cm x cm)',
                params: 'size',
                type: 'string'
            },
            {
                name: 'MoO3 (g)',
                params: 'Mo_content',
                type: 'number'
            },
            {
                name: 'S (g)',
                params: 'S_content',
                type: 'number'
            },
            {
                name: '擺片（犧牲 : 一般）',
                params: 'position_ratio',
                type: 'string'
            },
            {
                name: '加熱包/爐管距離 (cm)',
                params: 'heater_tube_distance',
                type: 'number'
            },
            {
                name: 'Ar Purge (sccm, min)',
                params: 'Ar_purge_params',
                type: 'string'
            },
            {
                name: 'Experiment Parameters (sccm, torr)',
                params: 'exp_env_params',
                type: 'string'
            },
            {
                name: '升溫目標 (TSP1)',
                params: 'TSP1',
                type: 'number'
            },
            {
                name: '升溫速率 (RMP1)',
                params: 'RMP1',
                type: 'number'
            },
            {
                name: '材料成長 (Temp, min)',
                params: 'exp_growth_params',
                type: 'string'
            },
            {
                name: '備註',
                params: 'comment',
                type: 'textarea'
            }
        ]
    },
    {
        key: 2,
        title: 'Transfer 材料轉移',
        params: [
            {
                name: '基板材質 (ex. HfO2)',
                params: 'substrate',
                type: 'string'
            },
            {
                name: 'Transfer 前 pc (%)',
                params: 'pc_percent_1',
                type: 'number'
            },
            {
                name: 'Transfer 前旋塗參數 (rpm,sec)',
                params: 'spin_coating_1',
                type: 'string'
            },
            {
                name: 'Transfer 後第一次烘烤 (Temp,min)',
                params: 'heat_after_transfer',
                type: 'string'
            },
            {
                name: 'Transfer 後 pc (%)',
                params: 'pc_percent_2',
                type: 'number'
            },
            {
                name: 'Transfer 後旋塗參數 (rpm,sec)',
                params: 'spin_coating_2',
                type: 'string'
            },
            {
                name: ' CF 靜置時間 (hrs)',
                params: 'cf_static_hrs',
                type: 'number'
            },
            {
                name: 'Transfer 最後烘烤 (Temp,min)',
                params: 'final_heat',
                type: 'string'
            },
            {
                name: '丙酮 Clean（Temp, min)',
                params: 'heat_with_acetone',
                type: 'string'
            },
            {
                name: '最終片號(1,3,5,...)',
                params: 'success_id',
                type: 'string'
            },
            {
                name: '備註',
                params: 'comment',
                type: 'textarea'
            },
        ]
    }
]