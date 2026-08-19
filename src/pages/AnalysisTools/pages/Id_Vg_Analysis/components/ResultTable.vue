<template>
    <div class="parameter-wrapper">
        <table class="parameter-table">
            <thead>
                <tr>
                    <th>V<span style="font-size: 10px;">d</span> (V)</th>
                    <th>V<span style="font-size: 10px;">th</span> (V)</th>
                    <th>I<span style="font-size: 10px;">on</span> (μA)</th>
                    <th>I<span style="font-size: 10px;">off</span> (μA)</th>
                    <th>I<span style="font-size: 10px;">on</span>/I<span style="font-size: 10px;">off</span></th>
                    <th>SS (mV/dec)</th>
                    <th>μ<span style="font-size: 10px;">eff</span> (F/cm²)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, id) in parameters" :key="id">
                    <td>{{ id }}</td>
                    <td>{{ (item.Vth)?.toFixed(2) }}</td>
                    <td>{{ (item.Ion)?.toFixed(2) }}</td>
                    <td>{{ (item.Ioff)?.toExponential(2) }}</td>
                    <td>{{ ((item.Ion) / (item.Ioff))?.toExponential(2) }}</td>
                    <td>{{ (item.SS)?.toFixed(2) }}</td>
                    <td>{{ (item.Mobility)?.toFixed(2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'ResultTable',
    props:{
        parameters:{
            type: Object,
            default: () => ({})
        }
    }
}
</script>

<style scoped>
    .parameter-wrapper{
        box-sizing: border-box;
        overflow-y: scroll;
        height: 100%;
    }
    .parameter-table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        text-align: left;
    }
    .parameter-table th {
        position: sticky;
        top: 0;
        background: white;
        z-index: 2;
    }
    .parameter-table th,td {
        padding-top: 15px;
        padding-bottom: 15px;
        padding-right: 15px;
        box-sizing: border-box;
        line-height: 1.5;
        font-size: 14px;
    }

    .parameter-table thead{
        box-sizing: border-box;
        border-bottom: 1px solid rgba(0, 0, 0, 0.02);
        font-weight: bolder;
    }

    .parameter-table th:nth-child(1),
    .parameter-table td:nth-child(1) {
        width: 10%;
        padding-left: 5px;
        word-break: break-all;
    }

    .parameter-table th:nth-child(2),
    .parameter-table td:nth-child(2) {
        width: 10%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(3),
    .parameter-table td:nth-child(3) {
        width: 10%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(4),
    .parameter-table td:nth-child(4) {
        width: 10%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(5),
    .parameter-table td:nth-child(5) {
        width: 10%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(6),
    .parameter-table td:nth-child(6) {
        width: 10%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(7),
    .parameter-table td:nth-child(7) {
        width: 10%;
        word-break: break-all;
    }

    .parameter-table tbody tr {
        transition: background-color 0.25s ease;
    }

    .parameter-table tbody tr:hover {
        background: rgba(0, 0, 0, 0.02);
        cursor: pointer;
    }
</style>