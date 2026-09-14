<template>
    <div class="parameter-wrapper" ref="tableWrapper" @scroll="handleScroll" v-if="tableData?.length">
        <table class="parameter-table">
            <thead>
                <tr>
                    <th>日期</th>
                    <th>時間</th>
                    <th>使用者名稱</th>
                    <th>操作明細</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(record, id) in tableData" :key="id">
                    <td>{{ record.date }}</td>
                    <td>{{ record.time }}</td>
                    <td>{{ record.user || '-' }}</td>
                    <td>{{ record.detail }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { eventBus } from '@/utils/eventBus';
import axios from 'axios';
import jsCookie from 'js-cookie';
import { ref, onMounted, computed, watch, onUnmounted, nextTick } from 'vue';

export default {
    name: 'EventTable',
    props:{
        targetDevice:{
            type: String,
            default: ''
        },
        polling:{
            type: Boolean,
            default: false,
        }
    },
    setup(props){

        const PAGE_SIZE = 15;
        const MAX_AUTO_FILL_ATTEMPTS = 3;
        let autoFillCount = 0;

        const page = ref(1);
        const tableData = ref([]);
        const hasMore = ref(true);
        const loading = ref(false);
        const tableWrapper = ref(null);

        async function checkScrollable() {
            await nextTick();
            if (!tableWrapper.value) return;

            const element = tableWrapper.value;
            const isScrollable = element.scrollHeight > element.clientHeight;

            if (!isScrollable && hasMore.value && !loading.value && autoFillCount < MAX_AUTO_FILL_ATTEMPTS) {
                autoFillCount++;
                page.value++;
            }
        }

        async function getData(reset = false){

            if (loading.value || !props.targetDevice) return;

            loading.value = true;

            try{
                const res = await axios.post('/api/door-access-control/admin/getEventLog',{
                    systemId: props.targetDevice, page: page.value
                },
                {
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    }
                })
                const newData = res.data.data || [];

                if (reset) {
                    tableData.value = newData;
                    autoFillCount = 0;
                } 
                else tableData.value.push(...newData);

                if (newData.length === 0 || newData.length < PAGE_SIZE || newData.some(i => i.index === '00000')) hasMore.value = false;

                if(res.data.type =='error') eventBus.emit('handleAlert', { title:'門禁紀錄獲取結果', message: res.data.message, type: res.data.type })

            }
            catch(e){
                console.log(e);
                hasMore.value = false;
            }
            finally{
                loading.value = false;
                if (hasMore.value) checkScrollable();
            }

        }

        let timer = null;

        async function polling(){
            page.value = 1;
            await getData(true);
        }

        onMounted(async()=>{
            timer = setInterval(async() => {
                if(props.polling) await polling();
            }, 5000);
        })

        onUnmounted(()=>{
            clearInterval(timer);
            timer = null;
        })

        // page 改變 → 取得下一頁
        watch(page, async () => {
            if (page.value === 1) return;
            await getData(false);
        });

        // 切換設備
        watch(() => props.targetDevice, async (newDevice) => {
            if (!newDevice) return;

            page.value = 1;
            autoFillCount = 0;
            tableData.value = [];
            hasMore.value = true;

            await getData(true);
        },{ immediate: true });


        function handleScroll(event) {
            const element = event.target;
            const scrollBottom = element.scrollTop + element.clientHeight;
            if (scrollBottom >= element.scrollHeight - 50 && !loading.value && hasMore.value) page.value++;
        }

        return {
            tableData, getData, handleScroll, tableWrapper
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
        width: 20%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(3),
    .parameter-table td:nth-child(3) {
        width: 20%;
        word-break: break-all;
    }
    .parameter-table th:nth-child(4),
    .parameter-table td:nth-child(4) {
        width: 40%;
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