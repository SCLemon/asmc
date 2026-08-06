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
                fixedrange: true,
                exponentformat: 'power',
            }
        });

        const plotLineConfig = ref({
            type: "scatter",
            mode: "lines",
            line: { color: "#3b82f6", width: 3 }
        })

        const plotData = ref([]);


        onMounted(async () => {
            Plotly.newPlot(chart.value, plotData.value, plotLayout.value, plotConfig);
            const cleanData = await useHandleData('./asset/id_vd.csv');
            console.log(cleanData)
            plotData.value = Object.entries(cleanData).map((group) => {
                return {
                    x: group[1]['increase'].x,
                    y: group[1]['increase'].y,
                    name: `Ig = ${group[0]} V`,
                    ...toRaw(plotLineConfig)
                }
            })
            
        });

        watch(
            () => [plotData.value, plotLayout.value, plotConfig.value],
            () => {
                const newData = structuredClone(plotData.value);  // 純 JS Object
                const newLayout = structuredClone(plotLayout.value); // 純 JS Object
                const newConfig = structuredClone(plotConfig.value)
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