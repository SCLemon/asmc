<template>
    <div class="parameter-wrapper">
        <table class="parameter-table" v-if="tableData?.length">
            <thead>
                <tr>
                    <th>CreateTime</th>
                    <th>Name</th>
                    <th>Member Counts</th>
                    <th>Asset Counts</th>
                    <th>Pending payment</th>
                    <th>Status</th>
                    <th>Options</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(lab, id) in filteredData" :key="id">
                    <td>{{ lab.createTime }}</td>
                    <td>{{ lab.name }}</td>
                    <td>{{ lab.memberCounts || 0 }} 人</td>
                    <td>{{ lab.equipmentCounts || 0 }} 台</td>
                    <td>$ {{ lab.unpaid || 0 }}</td>
                    <td>
                        <div v-if="lab.status" style="color: lightgreen;">有效</div>
                        <div v-else style="color: rgba(0,0,0,0.2);">凍結</div>
                    </td>
                    <td class="options">
                        <el-button @click="goToLabDetail(lab.token)">查看</el-button>
                        <el-button type="warning" @click="freeze(lab.token)">{{ lab.status ? '凍結' : '解凍' }}</el-button>
                        <el-button type="danger" @click="deleteLab(lab)">刪除</el-button>
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
    name: 'LabTable',
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
            return tableData.value.filter((lab)=>{
                return ((lab.name).toLowerCase()).includes((props.keyword).toLowerCase())
            })
        })

        onMounted(async ()=>{
            await getData();
        })

        async function getData(){
            const res = await axios.get('/api/labSetting/admin/getData',{
                headers:{
                    'x-user-token': jsCookie.get('authToken')
                }
            })
            tableData.value = res.data.data
        }
        
        function goToLabDetail(token){
            router.replace({
                path: '/settings/admin/lab-setting/edit',
                query: { 'targetLab': token }
            }).catch((e)=>{})
        }

        async function freeze(token){
            try{
                await ElMessageBox.confirm('確認凍結/解凍實驗室？', '修改權限',
                    {
                        confirmButtonText: '確認',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )
                const res = await axios.put('/api/labSetting/admin/freeze',{ targetLab: token },{
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                })
                eventBus.emit('handleAlert', { title:'實驗室狀態修改', message: res.data.message, type: res.data.type })
                await getData();
            }
            catch(e){}
        }

        async function deleteLab(lab){
            try{
                await ElMessageBox.confirm('確認刪除實驗室？', '刪除實驗室',
                    {
                        confirmButtonText: '確認',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )
                if(lab.unpaid && lab.unpaid > 0){
                    await ElMessageBox.confirm('該實驗室帳款未結清，仍要刪除實驗室？', '帳款未結清',
                        {
                            confirmButtonText: '確認',
                            cancelButtonText: '取消',
                            type: 'warning',
                        }
                    )
                }
                const res = await axios.post('/api/labSetting/admin/delete',{ targetLab: lab.token },{
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                })
                eventBus.emit('handleAlert', { title:'實驗室刪除結果', message: res.data.message, type: res.data.type })
                await getData();
            }
            catch(e){}
        }
        return {
            tableData, freeze, getData, goToLabDetail, deleteLab, filteredData
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
        width: 16.5%;
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
        width: 15%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(4),
    .parameter-table td:nth-child(4) {
        width: 15%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(5),
    .parameter-table td:nth-child(5) {
        width: 15%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(6),
    .parameter-table td:nth-child(6) {
        width: 15%;
        word-break: break-all;
    }
    .parameter-table th:nth-child(7),
    .parameter-table td:nth-child(7) {
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