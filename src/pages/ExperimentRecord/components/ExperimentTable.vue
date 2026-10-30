<template>
    <div class="parameter-wrapper">
        <table class="parameter-table" v-if="tableData?.length">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Owner</th>
                    <th>Recipe Name</th>
                    <th>
                        <div>Ion, Vth, SS, Contact @ [Vd, Vg, W, L]</div>
                        <div class="parameter-table-result-tooltip"></div>
                    </th>
                    <th>Options</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(exp, id) in filteredData" :key="id">
                    <td>{{ exp.createTime }}</td>
                    <td>{{ exp.owner }}</td>
                    <td>{{ exp.name }}</td>
                    <td>{{ exp.results }}</td>
                    <td class="options">
                        <el-button @click="goToExperimentRecordDetail(exp)">查看</el-button>
                        <el-button @click="goToExperimentRecordCloud(exp.token)">檔案</el-button>
                        <el-button type="danger" @click="deleteExperimentRecord(exp)">刪除</el-button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { eventBus } from '@/utils/eventBus';
import axios from 'axios';
import jsCookie from 'js-cookie';
import { ref, onMounted, computed, watch } from 'vue';
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router';

export default {
    name: 'ExperimentRecordTable',
    props:{
        keyword:{
            type: String,
            default: ''
        },
        group:{
            type: Number,
            default: 1
        }
    },
    setup(props){
        
        const router = useRouter();

        const tableData = ref([]);

        const filteredData = computed(()=>{
            return tableData.value.filter((exp)=>{
                return ((exp.name).toLowerCase()).includes((props.keyword).toLowerCase())
                || ((exp.owner).toLowerCase()).includes((props.keyword).toLowerCase())
            })
        })

        onMounted(async ()=>{
            await getData();
        })

        async function getData(){
            const res = await axios.get(`/api/experimentRecords/user/getData?group=${props.group}`,{
                headers:{
                    'x-user-token': jsCookie.get('authToken')
                }
            })
            tableData.value = res.data.data
        }
        
        function goToExperimentRecordDetail(exp){
            router.replace({
                path: '/experiment-records/edit',
                query: { 'targetRecord': exp.token, 'title': exp.name }
            }).catch((e)=>{})
        }
        function goToExperimentRecordCloud(token){
            router.replace(`/cloud/${token}`).catch((e)=>{})
        }


        async function deleteExperimentRecord(exp){
            try{
                await ElMessageBox.confirm('確認刪除實驗計畫？', '刪除計畫',
                    {
                        confirmButtonText: '確認',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )

                const { value } = await ElMessageBox.prompt('請輸入「確認刪除計畫」？', '再次確認',
                    {
                        confirmButtonText: '確認',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )

                if(value != '確認刪除計畫') return eventBus.emit('handleAlert', { title:'實驗計畫刪除結果', message: `確認訊息輸入錯誤 (您的輸入為：${value})`, type: 'error' });

                const res = await axios.post('/api/experimentRecords/user/delete',{ targetExperimentRecord: exp.token },{
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                })
                eventBus.emit('handleAlert', { title:'實驗計畫刪除結果', message: res.data.message, type: res.data.type })
                await getData();
            }
            catch(e){}
        }

        async function rate(exp){
            try{
                await ElMessageBox.confirm('確認實驗計畫評分操作？', '計畫評分',
                    {
                        confirmButtonText: '確認',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )
                const res = await axios.post('/api/experimentRecords/user/rate',{ targetExperimentRecord: exp.token, rate: exp.rate },{
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                })
                eventBus.emit('handleAlert', { title:'實驗計畫評分結果', message: res.data.message, type: res.data.type })
                await getData();
            }
            catch(e){}
        }

        watch(() => props.group, async()=>{
            await getData();
        })
        return {
            tableData, getData, goToExperimentRecordDetail, goToExperimentRecordCloud, deleteExperimentRecord, filteredData, rate
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
        word-break: keep-all;
    }

    .parameter-table th:nth-child(2),
    .parameter-table td:nth-child(2) {
        width: 10%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(3),
    .parameter-table td:nth-child(3) {
        width: 23%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(4),
    .parameter-table td:nth-child(4) {
        width: 32%;
        word-break: break-all;
    }
    .parameter-table th:nth-child(5),
    .parameter-table td:nth-child(5) {
        width: 25%;
        word-break: break-all;
    }

    .parameter-table tbody tr {
        transition: background-color 0.25s ease;
    }

    .parameter-table tbody tr:hover {
        background: rgba(0, 0, 0, 0.02);
        cursor: pointer;
    }
    .options{
        display: flex;
        align-items: center;
    }
    .options>.el-button{
        padding: 17.5px 17.5px;
    }
    @media screen and (max-width: 1032px) {
        .options>.el-button{
            padding: 14px 14px;
            font-size: 12px;
        }
    }
    @media screen and (max-width: 500px) {
        .options>.el-button{
            padding: 14px 14px;
            font-size: 12px;
        }
        .parameter-table th:nth-child(1),
        .parameter-table td:nth-child(1) {
            width: 100px;
            padding-left: 5px;
            word-break: keep-all;
        }

        .parameter-table th:nth-child(2),
        .parameter-table td:nth-child(2) {
            width: 100px;
            word-break: break-all;
        }

        .parameter-table th:nth-child(3),
        .parameter-table td:nth-child(3) {
            width: 250px;
            word-break: break-all;
        }

        .parameter-table th:nth-child(4),
        .parameter-table td:nth-child(4) {
            width: 350px;
            word-break: break-all;
        }
        .parameter-table th:nth-child(5),
        .parameter-table td:nth-child(5) {
            width: 200px;
            word-break: break-all;
        }
    }
</style>