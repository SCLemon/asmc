<template>
    <div>
        <div ref="chart" style="width: 100%; aspect-ratio: 2/1;"></div>
    </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import Plotly from "plotly.js/dist/plotly";

export default {
    name: 'IV_Analysis',
    setup() {
        const chart = ref();
        let timer = null;

        const plotLayout = ref({
            title: { text: "123" },
            xaxis: { title: { text: "X" }, fixedrange: true },
            yaxis: { title: { text: "Y" }, fixedrange: true }
        });

        const plotData = ref([
            {
                x:[1,2,3],
                y:[10,11,12],
                type: "scatter",
                mode: "lines",
                name: 'Temperature 1',
                line: { color: "#3b82f6", width: 3 }
            },
            {
                x:[1,2,3],
                y:[12,13,14],
                type: "scatter",
                mode: "lines",
                name: 'Temperature 2',
                line: { color: "#F59E0B", width: 3 }
            },
        ]);

        onMounted(() => {
            Plotly.react(chart.value, plotData.value, plotLayout.value);
            
            let i = 5;
            let k = 18;
            let v = 15;

            timer = setInterval(() => {

                plotData.value[0].x.push(i++);
                plotData.value[0].y.push(k++);

                plotData.value[1].x.push(i);
                plotData.value[1].y.push(v++);

            }, 1000);
        });

        watch(
            () => [plotData.value, plotLayout.value],
            () => {
                const newData = structuredClone(plotData.value);  // 純 JS Object
                const newLayout = structuredClone(plotLayout.value); // 純 JS Object
                Plotly.react(
                    chart.value, newData, newLayout // 不用 .value
                );
            },
            {
                deep: true
            }
        );

        onBeforeUnmount(() => {
            if (timer) clearInterval(timer);
        });

        return {
            chart
        };
    }
}
</script>

<style scoped>
</style>