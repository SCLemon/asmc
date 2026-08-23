<template>
    <div>
        <div class="chart-wrapper">
            <div class="chart-config-wrapper">
                <div class="analyzer-title">I<span style="font-size: 14px;">d</span>-V<span style="font-size: 14px;">g</span> Analyzer</div>
                <div class="chart-file-wrapper"><input type="file" @change="handleFile" accept=".csv"></div>
                <div class="chart-config-title-wrapper">
                    <div class="chart-config-title-title">Chart Title： </div>
                    <input type="text" v-model="plotLayout.title.text" class="chart-config-title-input">
                </div>
                <div class="chart-plot-type-wrapper">
                    <div class="chart-plot-type-title">PlotType：</div>
                    <div class="chart-plot-type-radio-wrapper">
                        <div><label><input class="chart-plot-type-radio" type="radio" v-model="plotType" :value="0"/>Both</label></div>
                        <div><label><input class="chart-plot-type-radio"  type="radio" v-model="plotType" :value="1"/>Increase</label></div>
                        <div><label><input class="chart-plot-type-radio"  type="radio" v-model="plotType" :value="2"/>Decrease</label></div>
                    </div>
                    <div class="chart-plot-type-radio-split-line">|</div>
                    <div class="chart-plot-type-radio-wrapper">
                        <div><label><input class="chart-plot-type-radio" type="radio" v-model="yAxisType" :value="0"/>Both</label></div>
                        <div><label><input class="chart-plot-type-radio"  type="radio" v-model="yAxisType" :value="1"/>Log</label></div>
                        <div><label><input class="chart-plot-type-radio"  type="radio" v-model="yAxisType" :value="2"/>Linear</label></div>
                    </div>
                </div>
                <div class="chart-config-title-wrapper">
                    <div class="chart-config-title-title">W (μm): </div>
                    <input type="number" step="0.1" v-model="width" class="chart-config-title-input">
                    <div class="chart-config-title-title">L (μm): </div>
                    <input type="number" step="0.1" v-model="length" class="chart-config-title-input">
                    <div class="chart-config-title-title">ε<span style="font-size: 12px;">r</span> : </div>
                    <input type="number" step="0.1" v-model="εr" class="chart-config-title-input">
                    <div class="chart-config-title-title">d (nm): </div>
                    <input type="number" step="0.1" v-model="thickness" class="chart-config-title-input">
                    <div class="chart-config-title-title">I(Vth): </div>
                    <input type="number" step="1e-9" v-model="iVth" class="chart-config-title-input">
                </div>
                <div v-if="showPlotsOptions.length">
                    <div class="chart-show-plot-wrapper">
                        <div class="chart-show-plot-title">ShowPlots：</div>
                        <div class="chart-show-plot-checkbox-wrapper">
                            <div v-for="(item, id) in showPlotsOptions" :key="id">
                                <label><input class="chart-show-plot-checkbox" type="checkbox" v-model="showPlots" :value="item.value"/>{{ item.label }}</label>
                            </div>
                        </div>
                    </div>
                    <div class="chart-result-wrapper">
                        <ResultTable :parameters="tableData"></ResultTable>
                    </div>
                </div>
            </div>
            <div ref="chart" class="chart"></div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useHandleData } from "./hooks/useHandleData";
import Plotly from "plotly.js/dist/plotly";
import ResultTable from "./components/ResultTable.vue";
import { useStatistics } from "./hooks/useStatistics";

export default {
    name: 'Id_Vg_Analysis',
    components:{
        ResultTable
    },
    setup() {

        // ========== Input Start ========== //


        const plotType = ref(2); // 0, 1, 2
        const yAxisType = ref(0); // 0, 1
        const showPlots = ref([]); // 1~N

        // for statistics
        const iVth = ref(1e-9);
        const width = ref(40);
        const length = ref(2);
        const thickness = ref(55); // 絕緣層厚度
        const εr = ref(3.9); //

        // ========== Input End ========== //


        // ========== Global Config Start ========== //
        const chart = ref();

        const plotConfig ={
            displaylogo: false,
            toImageButtonOptions: {
                format: 'png',
                filename: 'figure',
                width: 600,
                height: 600,
                scale: 3
            }
        }

        const plotLayout = ref({
            title: {
                text: "Id-Vg Curve"
            },

            xaxis: {
                title: {
                    text: "Gate Voltage Vg (V)"
                },
                fixedrange: true
            },

            yaxis: {
                title: {
                    text: "Drain Current Id (A/μm)"
                },
                type: "log",
                exponentformat: "power"
            },

            yaxis2: {
                title: {
                    text: "Drain Current Id (μA/μm)"
                },
                overlaying: "y",
                side: "right",
                type: "linear"
            },
            legend: {
                x: 0,
                y: 1,
                xanchor: "left",
                yanchor: "top"
            }
        })

        
        const plotLineConfig = ref(
            {
                'increase':{
                    type: "scatter",
                    mode: "lines",
                    line: { width: 3 }
                },
                'decrease':{
                    type: "scatter",
                    mode: "lines",
                    line: { width: 3 },
                }
            }
        )

        // ========== Global Config End ========== //


        // ========== Main Funcion Start ========== //

        let extractData; // function
        let grouppedData;
        let showPlotsOptions = ref([]);
        

        const plotData = ref([]);
        const tableData = ref([]);

        onMounted(()=>{
            // initialize plot
            Plotly.newPlot(chart.value, plotData.value, plotLayout.value, plotConfig);
        })

        const handleFile = async (event) => {
            
            showPlots.value = [];

            const file = event.target.files[0]

            const result = await useHandleData(file)
            extractData = result.extractData;
            grouppedData = result.grouppedData;

            // show plot options
            showPlotsOptions.value = Object.entries(grouppedData).map((item, id) => {
                showPlots.value.push(id+1);
                return { label: item[0], value: id+1 }
            })

            // plot
            plotData.value = extractData(plotType.value, yAxisType.value, plotLineConfig.value, showPlots.value, width.value)
            Plotly.react(chart.value, plotData.value, plotLayout.value, plotConfig);
                      
            // statistic
            tableData.value = useStatistics(result.grouppedData, width.value, length.value, εr.value, thickness.value, iVth.value)
        }


        // ========== Main Funcion End ========== //


        // ========== Watch Start ========== //
        
        // layout watcher
        watch(() => [plotData.value, plotLayout.value, plotConfig],() => {
            if(!plotData.value) return;
            const newData = structuredClone(plotData.value);
            const newLayout = structuredClone(plotLayout.value); 
            const newConfig = structuredClone(plotConfig)
            Plotly.react(chart.value, newData, newLayout, newConfig);
        }, { deep: true });

        // config input watcher
        watch(()=>[width.value, plotType.value, showPlots.value, yAxisType.value], async ()=>{
            if (!extractData) return;
            plotData.value = extractData(plotType.value, yAxisType.value, plotLineConfig.value, showPlots.value, width.value)
        }, { deep: true })

        //  for statistics
        watch(()=>[width.value, length.value, εr.value, thickness.value, iVth.value],()=>{
            if(!grouppedData) return;
            tableData.value = useStatistics(grouppedData, width.value, length.value, εr.value, thickness.value, iVth.value)
        }, { deep: true })

        // ========== Watch End ========== //

        return {
            chart, plotLayout, width, plotType, showPlots, showPlotsOptions, handleFile, yAxisType, tableData, thickness, εr, iVth, length
        };
    }
}
</script>

<style scoped>
    .chart-wrapper{
        width: 100%;
        height: 100vh;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    .chart{
        flex-shrink: 0;
        width: 600px;
        aspect-ratio: 1/1;
    }
    .chart-config-wrapper{
        width: calc(100% - 650px);
        height: 530px;
        margin-left: 25px;
    }

    .analyzer-title{
        font-size: 20px;
        font-weight: bolder;
        margin-bottom: 25px;
    }

    /* chart file */
    .chart-file-wrapper{
        margin-bottom: 10px;
    }
    .chart-file-wrapper input[type="file"]::file-selector-button {
        margin-right: 12.5px;
        border: 1px solid rgba(0,0,0,0.2);
        border-radius: 2px;
        padding: 3px 10px 3px 10px;
        background: transparent;
        transition: all 0.15s ease;
    }
    .chart-file-wrapper input[type="file"]::file-selector-button:hover{
        cursor: pointer;
        background: black;
        color: white;
    }

    /* chart title & normalized factor */
    .chart-config-title-wrapper{
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        gap: 15px;
    }
    .chart-config-title-title{
        flex-shrink: 0;
    }
    .chart-config-title-input{
        width: 100%;
        border-radius: 0;
        border: 0;
        border-bottom: 0.1px solid rgba(0,0,0,0.2);
        padding: 5px;
        text-align: center;
    }
    .chart-config-title-input:focus{
        outline: 0;
    }

    /* chart plot type */
    .chart-plot-type-wrapper{
        width: 100%;
        height: 40px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
    }
    .chart-plot-type-title{
        flex-shrink: 0;
    }
    .chart-plot-type-radio-wrapper{
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .chart-plot-type-radio{
        margin-right: 10px;
        display: inline-block;
    }
    .chart-plot-type-radio-split-line{
        margin-left: 16px;
        margin-right: 10px;
        color: rgba(0,0,0,0.2);
    }

    /* chart show plot */
    .chart-show-plot-wrapper{
        width: 100%;
        box-sizing: border-box;
        margin-top: 10px;
        margin-bottom: 5px;
        display: flex;
    }
    .chart-show-plot-title{
        flex-shrink: 0;
    }
    .chart-show-plot-checkbox-wrapper{
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
    }
    .chart-show-plot-checkbox{
        margin-right: 10px;
        display: inline-block;
    }

    /* chart result */
    .chart-result-wrapper{
        width: 100%;
        height: 275px;
        margin-top: 10px;
        overflow: hidden;
    }
</style>