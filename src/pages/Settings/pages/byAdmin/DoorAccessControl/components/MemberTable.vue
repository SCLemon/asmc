<template>
    <div class="parameter-wrapper" ref="tableWrapper" @scroll="handleScroll" v-if="tableData?.length">
        <table class="parameter-table">
            <thead>
                <tr>
                    <th>代號</th>
                    <th>使用者名稱</th>
                    <th>卡片識別碼</th>
                    <th>操作選項</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user, id) in tableData" :key="id">
                    <td>{{ user.address }}</td>
                    <td>{{ user.name == 'null' ? '-' : user.name }}</td>
                    <td>{{ user.cardUID == '65535:65535' ? '-' : user.cardUID }}</td>
                    <td class="options">
                        <el-button @click="openDialog(user.address)">指派</el-button>
                        <el-button type="danger" @click="clear(user.address)">清除</el-button>
                    </td>
                </tr>
            </tbody>
        </table>
          <el-dialog v-model="dialogVisible" title="門禁授權" width="500">
                <el-select v-model="selectedUser" placeholder="Select" style="width: 100%;">
                    <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="closeDialog()">取消</el-button>
                    <el-button type="primary" @click="add()">授權</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { eventBus } from '@/utils/eventBus';
import axios from 'axios';
import jsCookie from 'js-cookie';
import { ref, onMounted, computed, watch } from 'vue';

export default {
    name: 'MemberTable',
    props:{
        targetDevice:{
            type: String,
            default: ''
        }
    },
    setup(props){

        const page = ref(1);
        const tableData = ref([]);
        const hasMore = ref(true);
        const loading = ref(false);
        const tableWrapper = ref(null);
        
        const dialogVisible = ref(false)
        const userList = ref([])
        const selectedUser = ref(null);
        const selectedAddress = ref(null);

        function openDialog(address){
            selectedAddress.value = address;
            dialogVisible.value = true;
        }

        function closeDialog(address){
            selectedAddress.value = null;
            dialogVisible.value = false;
            selectedUser.value = null;
        }

        onMounted(async ()=>{
            await getUserList();
        })

        async function getUserList(){

            try{
                const res = await axios.get('/api/door-access-control/admin/getUserList',
                {
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                })
                if(res.data.type == 'success') userList.value = res.data.data
            }
            catch(e){}

        }

        async function getData(reset = false){

            if (loading.value || !props.targetDevice) return;

            loading.value = true;

            try{
                const res = await axios.post('/api/door-access-control/admin/getUserList',{
                    systemId: props.targetDevice, page: page.value
                },
                {
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    }
                })
                const newData = res.data.data || [];

                // 換設備 / 第一頁
                if (reset) {
                    tableData.value = newData;
                }

                else tableData.value.push(...newData);

                if (newData.length < 15)  hasMore.value = false;

                if(res.data.type =='error') eventBus.emit('handleAlert', { title:'門禁權限獲取結果', message: res.data.message, type: res.data.type })
            }
            catch(e){
                console.log(e)
            }
            finally{
                loading.value = false;
            }

        }

        async function clear(address){

            try{
                const res = await axios.post('/api/door-access-control/admin/deleteUser',{
                    systemId: props.targetDevice, uAddr: address
                },
                {
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    }
                })

                eventBus.emit('handleAlert', { title:'門禁權限清除結果', message: res.data.message, type: res.data.type })
                if(res.data.type == 'success') await getData(true)

            }
            catch(e){}

        }

        async function add(){

            try{
                const res = await axios.post('/api/door-access-control/admin/addUser',{
                    systemId: props.targetDevice, uAddr: selectedAddress.value, targetUser: selectedUser.value,
                },
                {
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    }
                })

                eventBus.emit('handleAlert', { title:'門禁權限新增結果', message: res.data.message, type: res.data.type })
                if(res.data.type == 'success'){
                    closeDialog();
                    await getData(true)
                }


            }
            catch(e){}
            finally{
                closeDialog();
            }

        }

       // page 改變 → 取得下一頁
        watch(page, async () => {

            if (page.value === 1) return;
            await getData(false);

        });


        // 切換設備
        watch(() => props.targetDevice, async (newDevice) => {

            if (!newDevice) return;

            page.value = 1;

            tableData.value = [];

            hasMore.value = true;

            await getData(true);

        },{ immediate: true });

        function handleScroll(event) {

            const element = event.target;

            const scrollBottom = element.scrollTop + element.clientHeight;

            // 距離底部 50px 就開始載入
            if (scrollBottom >= element.scrollHeight - 50 && !loading.value && hasMore.value) page.value++;

        }

        return {
            tableData, getData, handleScroll, tableWrapper, clear, dialogVisible, add, userList, openDialog, closeDialog, selectedUser
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
        width: 15%;
        padding-left: 5px;
        word-break: break-all;
    }

    .parameter-table th:nth-child(2),
    .parameter-table td:nth-child(2) {
        width: 25%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(3),
    .parameter-table td:nth-child(3) {
        width: 30%;
        word-break: break-all;
    }
    .parameter-table th:nth-child(4),
    .parameter-table td:nth-child(4) {
        width: 30%;
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