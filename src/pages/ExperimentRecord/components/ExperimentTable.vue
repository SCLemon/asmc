<template>
    <div class="parameter-wrapper">
        <table class="parameter-table" v-if="tableData?.length">
            <thead>
                <tr>
                    <th>CreateTime</th>
                    <th>Owner</th>
                    <th>Recipe Name</th>
                    <th>Rate</th>
                    <th>Options</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(exp, id) in filteredData" :key="id">
                    <td>{{ exp.createTime }}</td>
                    <td>{{ exp.owner }}</td>
                    <td>{{ exp.name }}</td>
                    <td><el-rate v-model="exp.rate" allow-half :disabled="!(exp.isMine)" @change="rate(exp)"/></td>
                    <td class="options">
                        <el-button @click="goToExperimentRecordDetail(exp.token)">查看</el-button>
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
import { ref, onMounted, computed } from 'vue';
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router';

export default {
    name: 'ExperimentRecordTable',
    props:{
        keyword:{
            type: String,
            default: ''
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
            const res = await axios.get('/api/experimentRecords/user/getData',{
                headers:{
                    'x-user-token': jsCookie.get('authToken')
                }
            })
            tableData.value = res.data.data
        }
        
        function goToExperimentRecordDetail(token){
            // router.replace({
            //     path: '/settings/admin/lab-setting/edit',
            //     query: { 'targetLab': token }
            // }).catch((e)=>{})
            eventBus.emit('handleAlert', { title:'實驗計畫功能', message: '實驗計畫功能正在開發中...', type: 'warning' })
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
        width: 20%;
        padding-left: 5px;
        word-break: break-all;
    }

    .parameter-table th:nth-child(2),
    .parameter-table td:nth-child(2) {
        width: 15%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(3),
    .parameter-table td:nth-child(3) {
        width: 22.5%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(4),
    .parameter-table td:nth-child(4) {
        width: 17.5%;
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
    .options>.el-button{
        padding: 17.5px 17.5px;
    }
</style>