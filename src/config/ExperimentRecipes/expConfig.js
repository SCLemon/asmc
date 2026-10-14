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
        title: 'PL/Raman 光學檢測',
        params: [

        ]
    },
    {
        key: 3,
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
    },
    {
        key: 4,
        title: 'Exposure and Development 曝光顯影',
        params: [
            {
                name: '曝光用途',
                params: 'reason',
                type: 'string'
            },
            {
                name: '曝光方法 (ex. MLA150, 接觸式曝光,...)',
                params: 'method',
                type: 'string'
            },
            {
                name: '光罩檔案名稱',
                params: 'design_file',
                type: 'string'
            },
            {
                name: '對準配置名稱',
                params: 'alignment_setting',
                type: 'string'
            },
            {
                name: '光阻類型 (ex. APOL/負)',
                params: 'photoresist',
                type: 'string'
            },
            {
                name: '旋塗參數 (rpm,sec)',
                params: 'spin_coating',
                type: 'string'
            },
            {
                name: '旋塗後烘烤 (Temp,min)',
                params: 'heat_after_coating',
                type: 'string'
            },
            {
                name: '曝光參數 Dose',
                params: 'dose',
                type: 'number'
            },
            {
                name: '曝光參數 Defocus',
                params: 'defocus',
                type: 'number'
            },
            {
                name: '曝光後烘烤 (Temp,min)',
                params: 'heat_after_exposure',
                type: 'string'
            },
            {
                name: '顯影液類型 (ex. AD-10)',
                params: 'developing solution',
                type: 'string'
            },
            {
                name: '顯影時間 (sec)',
                params: 'developing_time',
                type: 'number'
            },
            {
                name: '顯影後烘烤 (Temp,min)',
                params: 'heat_after_development',
                type: 'string'
            },
            {
                name: '備註',
                params: 'comment',
                type: 'textarea'
            },
        ]
    },
    {
        key: 5,
        title: 'PVD 物理氣相沉積 (蒸鍍）',
        params: [
            {
                name: '蒸鍍環境壓力 (torr)',
                params: 'pressure',
                type: 'string'
            },
            {
                name: '石英震盪片頻率',
                params: 'frequency',
                type: 'number'
            },
            {
                name: '第一次蒸鍍金屬 (電極/厚度/鍍率/融化電流/操作電流）',
                params: 'metal_1',
                type: 'string'
            },
            {
                name: '第二次蒸鍍金屬 (電極/厚度/鍍率/融化電流/操作電流）',
                params: 'metal_2',
                type: 'string'
            },
            {
                name: '第三次蒸鍍金屬 (電極/厚度/鍍率/融化電流/操作電流）',
                params: 'metal_3',
                type: 'string'
            },
            {
                name: '第四次蒸鍍金屬 (電極/厚度/鍍率/融化電流/操作電流）',
                params: 'metal_4',
                type: 'string'
            },
            {
                name: '備註',
                params: 'comment',
                type: 'textarea'
            },
        ]
    },
    {
        key: 6,
        title: 'RIE 反應式離子蝕刻',
        params: [
            {
                name: '蝕刻環境壓力 (torr)',
                params: 'pressure',
                type: 'string'
            },
            {
                name: 'Wf (入射功率)',
                params: 'forward_power',
                type: 'number'
            },
            {
                name: 'Wr (反射功率)',
                params: 'reverse_power',
                type: 'number'
            },
            {
                name: 'CT (匹配電容)',
                params: 'tune_capacitor',
                type: 'number'
            },
            {
                name: 'CL (負載電容)',
                params: 'load_capacitor',
                type: 'number'
            },
            {
                name: '蝕刻時間 (sec)',
                params: 'main_etch_time',
                type: 'number'
            },
            {
                name: '備註',
                params: 'comment',
                type: 'textarea'
            },
        ]
    },
    {
        key: 7,
        title: 'ALD 原子層沉積',
        params: [

        ]
    },
    {
        key: 8,
        title: 'ICP 感應耦合電漿蝕刻',
        params: [

        ]
    },
    {
        key: 9,
        title: 'B1500A 電性量測',
        params: [
            {
                name: '最佳量測片號（ex. #5, 11-33)',
                params: 'best-die',
                type: 'string'
            },
            {
                name: '取樣條件 [Vd(V), Vg(V), W(um), L(um), ex. 1, 5, 40, 1]',
                params: 'conditions',
                type: 'string'
            },
            {
                name: 'Contact Type (Schottky or Ohmic)',
                params: 'contact_type',
                type: 'string'
            },
            {
                name: 'Vth (V)',
                params: 'Vth',
                type: 'number'
            },
            {
                name: 'Ion (uA/um)',
                params: 'Ion',
                type: 'number'
            },
            {
                name: 'Ion/Ioff',
                params: 'Ion_Ioff',
                type: 'number'
            },
            {
                name: 'SS (mV/dec)',
                params: 'SS',
                type: 'number'
            },
            {
                name: '備註',
                params: 'comment',
                type: 'textarea'
            },
        ]
    },
]