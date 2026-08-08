<template>
    <div>
        <div ref="chart" class="chart"></div>
    </div>
</template>

<script>
import { ref, onMounted, watch, toRaw } from "vue";
import { useHandleData } from "./hooks/useHandleData";
import Plotly from "plotly.js/dist/plotly";

// #3b82f6, #F59E0B
export default {
    name: 'Id_Vd_Analysis',
    setup() {
        const chart = ref();

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
                text: "Id-Vd Curve" 
            },
            xaxis: { 
                title: { text: "Vd" }, 
                fixedrange: true,
            },
            yaxis: { 
                title: { text: "Id" }, 
                exponentformat: 'power',
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

        const plotData = ref([]);

        onMounted(async () => {
            Plotly.newPlot(chart.value, plotData.value, plotLayout.value, plotConfig);
            const { extractData } = await useHandleData('./asset/id_vd.csv');
            plotData.value = extractData(1, plotLineConfig.value)
        });

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


        return {
            chart
        };
    }
}
</script>

<style scoped>
    .chart{
        width: 900px;
        aspect-ratio: 16 / 9;
    }
</style>