<template>
    <div class="parameter-wrapper">
        <table class="parameter-table" v-if="tableData?.length">
            <thead>
                <tr>
                    <th>預約日期</th>
                    <th>預約時段</th>
                    <th>儀器名稱</th>
                    <th>操作選項</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(record, id) in filteredData" :key="id">
                    <td>{{ record.reserve_date }}</td>
                    <td>{{ record.reserve_period}}</td>
                    <td>{{ record.equipment }}</td>
                    <td class="options">
                        <div v-if="record?.signIn?.showBtn">
                            <el-button type="warning" @click="record?.signIn?.canSignIn?signIn(record.reserveId):''" 
                                :disabled="!(record?.signIn?.canSignIn)">{{ record?.signIn?.showButtonText }}
                            </el-button>
                            <el-button type="danger" v-if="record.showCancelBtn" @click="deleteReserve(record.reserveId)">刪除</el-button>
                        </div>
                        <div v-else style="color: rgba(0,0,0,0.2);">{{ record?.signIn?.showButtonText }}</div>
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

export default {
    name: 'ReserveationTable',
    props:{
        keyword:{
            type: String,
            default: ''
        }
    },
    setup(props){
        
        const tableData = ref([]);

        const filteredData = computed(()=>{
            return tableData.value.filter((record)=>{
                return ((record.equipment).toLowerCase()).includes((props.keyword).toLowerCase())
            })
        })

        onMounted(async ()=>{
            await getData();
        })

        async function getData(){
            const res = await axios.get('/api/reservationRecord/user/getData',{
                headers:{
                    'x-user-token': jsCookie.get('authToken')
                }
            })
            tableData.value = res.data.data
        }


        async function signIn(reserveId){
            try{
                await ElMessageBox.confirm('確認預約簽到？', '預約簽到',
                    {
                        confirmButtonText: '確認',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )
                const res = await axios.post('/api/reservationRecord/user/signIn',{ reserveId },{
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                })
                eventBus.emit('handleAlert', { title:'預約簽到結果', message: res.data.message, type: res.data.type })
                await getData();
            }
            catch(e){}
        }

        async function deleteReserve(reserveId){
            try{
                await ElMessageBox.confirm('確認刪除預約？', '刪除預約',
                    {
                        confirmButtonText: '確認',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )
                const res = await axios.post('/api/reservationRecord/user/cancel',{ reserveId },{
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                })
                eventBus.emit('handleAlert', { title:'預約刪除結果', message: res.data.message, type: res.data.type })
                await getData();
            }
            catch(e){}
        }
        return {
            tableData, getData, deleteReserve, filteredData, signIn
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
        width: 25%;
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
        width: 25%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(4),
    .parameter-table td:nth-child(4) {
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