<template>
    <div class="parameter-wrapper">
        <table class="parameter-table" v-if="tableData?.length">
            <thead>
                <tr>
                    <th>App Name</th>
                    <th>Version</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Options</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(tool, id) in filteredData" :key="id">
                    <td>{{ tool.name }}</td>
                    <td>{{ tool.version || '-' }}</td>
                    <td>{{ tool.author || '-'}}</td>
                    <td>
                        <div v-if="tool.status" style="color: lightgreen;">有效</div>
                        <div v-else style="color: rgba(0,0,0,0.2);">凍結</div>
                    </td>
                    <td class="options">
                        <el-button @click="goToToolDetail(tool.token)">查看</el-button>
                        <el-button @click="goToToolFolder(tool.token)">檔案</el-button>
                        <el-button type="warning" @click="freeze(tool.token)">{{ tool.status ? '隱藏' : '公開' }}</el-button>
                        <el-button type="danger" @click="deleteTool(tool.token)">刪除</el-button>
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
    name: 'ToolTable',
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
            return tableData.value.filter((tool)=>{
                return ((tool.name).toLowerCase()).includes((props.keyword).toLowerCase())
            })
        })

        onMounted(async ()=>{
            await getData();
        })

        async function getData(){
            const res = await axios.get('/api/toolSetting/admin/getData',{
                headers:{
                    'x-user-token': jsCookie.get('authToken')
                }
            })
            tableData.value = res.data.data
        }

        function goToToolDetail(token){
            router.replace({
                path: '/settings/admin/tool-setting/edit',
                query: {
                    'method': 'revise',
                    'targetTool': token,
                    'redirect': '/settings/admin/tool-setting'
                }
            }).catch((e)=>{})
        }

        function goToToolFolder(token){
            router.replace({
                path: `/cloud/${token}`,
            }).catch((e)=>{})
        }

        async function freeze(token){
            try{
                await ElMessageBox.confirm('確認公開/隱藏工具？', '修改權限',
                    {
                        confirmButtonText: '確認',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )
                const res = await axios.put('/api/toolSetting/admin/freeze',{ targetTool: token },{
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                })
                eventBus.emit('handleAlert', { title:'工具狀態修改', message: res.data.message, type: res.data.type })
                await getData();
            }
            catch(e){}
        }

        async function deleteTool(token){
            try{
                await ElMessageBox.confirm('此操作將永久刪除所有與其相關之資料。', '刪除工具',
                    {
                        confirmButtonText: '確認',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )
                const { value } = await ElMessageBox.prompt('請輸入操作確認提示：「確認刪除」。', '輸入刪除指令',
                    {
                        confirmButtonText: '確認',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )

                if(value != '確認刪除') return eventBus.emit('handleAlert', { title:'用戶刪除結果', message: '刪除指令輸入錯誤', type: 'error' })

                const res = await axios.post('/api/toolSetting/admin/delete',{ targetTool: token },{
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                })
                eventBus.emit('handleAlert', { title:'工具刪除結果', message: res.data.message, type: res.data.type })
                await getData();
            }
            catch(e){}
        }
        return {
            tableData, freeze, getData, deleteTool, filteredData, goToToolDetail, goToToolFolder
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
        word-break: keep-all;
        overflow-wrap: break-word;
        white-space: normal;
    }

    .parameter-table th:nth-child(2),
    .parameter-table td:nth-child(2) {
        width: 20%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(3),
    .parameter-table td:nth-child(3) {
        width: 17.5%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(4),
    .parameter-table td:nth-child(4) {
        width: 15%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(5),
    .parameter-table td:nth-child(5) {
        width: 27.5%;
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
    @media screen and (max-width: 1180px) {
        .options>.el-button{
            padding: 10px 10px;
            font-size: 12px;
        }
    }
</style>