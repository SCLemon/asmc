<template>
    <div>
        <div class="chart-wrapper">
            <div class="chart-config-wrapper">
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
    name: 'Id_Vg_Analysis',
    setup() {
        const chart = ref();

        // ========== Global Config Start ========== //
        
        const plotConfig ={
            displaylogo: false,
            toImageButtonOptions: {
                format: 'png',
                filename: 'figure',
                width: 1600,
                height: 900,
                scale: 3
            }
        }

        const plotLayout = ref({
            title: { 
                text: "Id-Vg Curve" 
            },
            xaxis: { 
                title: { text: "Vg (V)" }, 
                fixedrange: true,
            },
            yaxis: { 
                title: { text: "Drain Current Id" }, 
                exponentformat: 'log',
            }
        });

        
        const plotLineConfig = ref(
            {
                'increase':{
                    type: "scatter",
                    mode: "lines",
                    line: { color: "#3b82f6", width: 3 }
                },
                'decrease':{
                    type: "scatter",
                    mode: "lines",
                    line: { color: " #F59E0B", width: 3 },
                }
            }
        )

        // ========== Global Config End ========== //


        // ========== Input Start ========== //

        const normalized_factor = ref(1);
        const plotType = ref(0);
        const showPlots = ref([]);

        // ========== Input End ========== //


        // ========== Main Funcion Start ========== //

        let extractData;
        let showPlotsOptions = ref([]);

        const plotData = ref([]);
        
        onMounted(async () => {

            // raw data
            const result = await useHandleData('./asset/id_vg.csv')
            extractData = result.extractData;

            // show plot options
            showPlotsOptions.value = Object.entries(result.grouppedData).map((item, id) => {
                return { label: item[0], value: id+1 }
            })

            // initial plot
            Plotly.newPlot(chart.value, plotData.value, plotLayout.value, plotConfig);
            plotData.value = extractData(plotType.value, plotLineConfig.value, showPlots.value, normalized_factor.value)
        });
        

        // ========== Main Funcion End ========== //

        // ========== Watch Start ========== //


        // layout
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

        // config input
        watch(()=>[
            normalized_factor.value, plotType.value, showPlots.value
        ], 
        async ()=>{
            plotData.value = extractData(plotType.value, plotLineConfig.value, showPlots.value, normalized_factor.value)
        }, { deep: true })

        // ========== Watch End ========== //

        return {
            chart, plotLayout, normalized_factor, plotType, showPlots, showPlotsOptions
        };
    }
}
</script>

<style scoped>
    .chart-wrapper{
        width: 100%;
        height: 650px;
        border: 1px solid red;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }
    .chart-config-wrapper{
        width: calc(100% - 650px);
        height: 400px;
        margin-left: 10px;
    }
    .chart{
        flex-shrink: 0;
        width: 600px;
        aspect-ratio: 1/1;
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