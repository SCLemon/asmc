<template>
    <div>
        <div class="chart-wrapper">
            <div class="chart-config-wrapper">
                <div class="analyzer-title">I<span style="font-size: 14px;">d</span>-V<span style="font-size: 14px;">d</span> Analyzer</div>
                <div class="chart-file-wrapper"><input type="file" @change="handleFile" accept=".csv"></div>
                <div class="chart-config-title-wrapper">
                    <div class="chart-config-title-title">Chart Title： </div>
                    <input type="text" v-model="plotLayout.title.text" class="chart-config-title-input">
                </div>
                <div class="chart-config-title-wrapper">
                    <div class="chart-config-title-title">Normalized Factor： </div>
                    <input type="number" v-model="normalized_factor" class="chart-config-title-input">
                </div>
                <div class="chart-plot-type-wrapper">
                    <div class="chart-plot-type-title">PlotType：</div>
                    <div class="chart-plot-type-radio-wrapper">
                        <div><label><input class="chart-plot-type-radio" type="radio" v-model="plotType" :value="0"/>Both</label></div>
                        <div><label><input class="chart-plot-type-radio"  type="radio" v-model="plotType" :value="1"/>Increase</label></div>
                        <div><label><input class="chart-plot-type-radio"  type="radio" v-model="plotType" :value="2"/>Decrease</label></div>
                    </div>
                </div>
                <div class="chart-plot-type-wrapper">
                    <div class="chart-plot-type-title">ShowPlots：</div>
                    <div class="chart-plot-type-radio-wrapper">
                        <div v-for="(item, id) in showPlotsOptions" :key="id">
                            <label><input class="chart-plot-type-radio" type="checkbox" v-model="showPlots" :value="item.value"/>{{ item.label }}</label>
                        </div>
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


// #3b82f6, #F59E0B
export default {
    name: 'Id_Vd_Analysis',
    setup() {

        const chart = ref();

        // ========== Global Config Start ========== //
        
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
                text: "Id-Vd Curve" 
            },
            xaxis: { 
                title: { text: "Vd (V)" }, 
                fixedrange: true,
            },
            yaxis: { 
                title: { text: "Drain Current Id" }, 
                exponentformat: 'linear',
            },
            legend: {
                x: 0,
                y: 1,
                xanchor: "left",
                yanchor: "top"
            }
        });

        
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


        // ========== Input Start ========== //

        const normalized_factor = ref(40);
        const plotType = ref(2);
        const showPlots = ref([]);

        // ========== Input End ========== //


        // ========== Main Funcion Start ========== //

        let extractData;
        let showPlotsOptions = ref([]);

        const plotData = ref([]);

        onMounted(()=>{
            Plotly.newPlot(chart.value, plotData.value, plotLayout.value, plotConfig);
        })

        const handleFile = async (event) => {

            showPlots.value = [];

            const file = event.target.files[0]

            const result = await useHandleData(file)
            extractData = result.extractData;

            // show plot options
            showPlotsOptions.value = Object.entries(result.grouppedData).map((item, id) => {
                showPlots.value.push(id+1);
                return { label: item[0], value: id+1 }
            })

            // initial plot
            plotData.value = extractData(plotType.value, plotLineConfig.value, showPlots.value, normalized_factor.value)
            Plotly.react(chart.value, plotData.value, plotLayout.value, plotConfig);
        }


        // ========== Main Funcion End ========== //



        // ========== Watch Start ========== //
        
        // layout watcher
        watch(
            () => [plotData.value, plotLayout.value, plotConfig],
            () => {
                const newData = structuredClone(plotData.value);
                const newLayout = structuredClone(plotLayout.value); 
                const newConfig = structuredClone(plotConfig)
                Plotly.react(chart.value, newData, newLayout, newConfig);
            },
            { deep: true }
        );

        // config input watcher
        watch(()=>[
            normalized_factor.value, plotType.value, showPlots.value
        ], 
        async ()=>{
            if (!extractData) return;
            plotData.value = extractData(plotType.value, plotLineConfig.value, showPlots.value, normalized_factor.value)
        }, { deep: true })

        // ========== Watch End ========== //

        return {
            chart, plotLayout, normalized_factor, plotType, showPlots, showPlotsOptions, handleFile
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
    .chart-file{

    }

    /* chart title & normalized factor */
    .chart-config-title-wrapper{
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        gap: 10px;
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
        margin-top: 5px;
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
</style>