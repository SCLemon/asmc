<template>
    <div class="parameter-wrapper">
        <table class="parameter-table">
            <thead>
                <tr>
                    <th>CreateTime</th>
                    <th>Level</th>
                    <th>Name</th>
                    <th>ID Card</th>
                    <th>IP Address</th>
                    <th>Status</th>
                    <th>Options</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user, id) in tableData" :key="id">
                    <td>{{ user.createTime }}</td>
                    <td>Level {{ user.level }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.id_card }}</td>
                    <td>{{ user.ip }}</td>
                    <td>
                        <div v-if="user.status" style="color: lightgreen;">有效</div>
                        <div v-else style="color: rgba(0,0,0,0.2);">凍結</div>
                    </td>
                    <td class="options">
                        <el-button>查看</el-button>
                        <el-button type="warning" @click="freeze(user.token)">{{ user.status ? '凍結' : '解凍' }}</el-button>
                        <el-button type="danger" @click="deleteUser(user.token)">刪除</el-button>
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
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
    name: 'MemberTable',
    setup(){
        
        const tableData = ref([]);


        onMounted(async ()=>{
            await getData();
        })

        async function getData(){
            const res = await axios.get('/api/memberSetting/getData',{
                headers:{
                    'x-user-token': jsCookie.get('authToken')
                }
            })
            tableData.value = res.data.data
        }


        async function freeze(token){
            try{
                await ElMessageBox.confirm('確認凍結/解凍用戶？', '修改權限',
                    {
                        confirmButtonText: '確認',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )
                const res = await axios.put('/api/memberSetting/freeze',{ targetUser: token },{
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                })
                eventBus.emit('handleAlert', { title:'用戶狀態修改', message: res.data.message, type: res.data.type })
                await getData();
            }
            catch(e){}
        }

        async function deleteUser(token){
            try{
                await ElMessageBox.confirm('確認刪除用戶？', '刪除用戶',
                    {
                        confirmButtonText: '確認',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )
                const res = await axios.post('/api/memberSetting/delete',{ targetUser: token },{
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                })
                eventBus.emit('handleAlert', { title:'用戶刪除結果', message: res.data.message, type: res.data.type })
                await getData();
            }
            catch(e){}
        }
        return {
            tableData, freeze, getData, deleteUser
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
        width: 17.5%;
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
        width: 10%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(7),
    .parameter-table td:nth-child(7) {
        width: 22.5%;
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