<template>
    <div class="parameter-wrapper">
        <table class="parameter-table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Publication</th>
                    <th>Year</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, id) in parameters" :key="id">
                    <td>{{ item.title }}</td>
                    <td>{{ item.publication }}</td>
                    <td>{{ item.year }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'PaperList',
    props:{
        title:{
            type: String,
            default: 'Research Paper'
        },
        parameters:{
            type: Array,
            default:[],
        }
    }
}
</script>

<style scoped>
    .parameter-wrapper{
        box-sizing: border-box;
    }
    .parameter-title{
        font-size: 18px;
        margin-top: 30px;
        margin-bottom: 30px;
    }
    .parameter-table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        text-align: left;
        margin-top: 20px;
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
        width: 55;
        padding-left: 5px;
        word-break: break-all;
    }

    .parameter-table th:nth-child(2),
    .parameter-table td:nth-child(2) {
        width: 35%;
    }
    .parameter-table td:nth-child(2){
        padding-right: 30px;
    }

    .parameter-table th:nth-child(3),
    .parameter-table td:nth-child(3) {
        width: 10%;
        overflow: hidden;
    }

    .parameter-table tbody tr {
        transition: background-color 0.25s ease;
    }

    .parameter-table tbody tr:hover {
        background: rgba(0, 0, 0, 0.02);
        cursor: pointer;
    }
</style>