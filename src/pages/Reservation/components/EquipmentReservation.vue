<template>
    <div>
        <el-date-picker v-model="date" type="daterange" single-panel style="width: 100%; box-sizing: border-box;" readonly/>

        <div class="calendar-wrapper">
            <div class="calendar-item-wrapper-all" v-for="item in reservationData" :key="item.date">
                <div class="calendar-item-title">{{ item.title }}</div>
                <div class="calendar-item-wrapper">
                    <div
                        :class="{
                            'calendar-item': true,
                            [`calendar-item-status-${getPeriod(item, period)?.status}`]: !isPast(item.date, period) && !(getPeriod(item, period).isMine),
                            'calendar-item-status-is-Mine': getPeriod(item, period)?.status!= -1 && !isPast(item.date, period) && getPeriod(item, period).isMine,
                            'calendar-item-status--1': isPast(item.date, period) || (getPeriod(item, period)?.status == -1)
                        }"
                        v-for="period in periodList" :key="period" :title="period"
                        @click="getPeriod(item, period)?.status != -1 && !isPast(item.date, period) ? handle(getPeriod(item, period), item.date, period) : ''">
                        {{ getPeriodLabel(item, period) }}
                        <div class="calendar-item-is-Mine"><VIcon :icon="UserIcon" v-if="!isPast(item.date, period) && getPeriod(item, period)?.status!= -1 && getPeriod(item, period).isMine"></VIcon></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import jsCookie from 'js-cookie';
import { eventBus } from '@/utils/eventBus.js';
import { ElMessageBox } from 'element-plus'
import { VIcon } from 'vorium-ui';
import { UserIcon } from 'vorium-ui/icons'
import 'vorium-ui/icons/icons.css'

export default {
    name: 'EquipmentReservation',
    props:{
        targetEquipment:{
            type: String,
            default: '',
        }
    },
    components:{
        VIcon
    },
    setup(props){
        
        const date = ref([new Date().getTime(), new Date().setDate(new Date().getDate() + 6)]);
        const periodList = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

        const reservationData = ref([]);

        function isPast(date, period) {
            return new Date(`${date}T${period}:00`) <= new Date();
        }

        async function getData(){
            try{
                const res = await axios.post('/api/reservation/user/getSpecificReservationData',{ targetEquipment: props.targetEquipment, date: date.value },{
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                });

                reservationData.value = res.data.data;

                if(res.data.type == 'error') eventBus.emit('handleAlert', { title:'儀器獲取資訊', message: res.data.message, type: res.data.type })
            }
            catch(e){
                console.log(e)
            }
        }

        function getPeriod(item, period) { // 返回 reserve 項目
            return item.date_period.find((i) => i.reserve_period === period);
        }

        function getPeriodLabel(item, period) {

            const data = getPeriod(item, period);
            if (isPast(item.date, period) || data?.status == -1) return '-';
            else if(data?.status != 0) return data.userName

            return period;
        }

        async function handle(reserve, date, period){

            let method = undefined;

            try{
                try{
                    await ElMessageBox.confirm('確認預約該時段？', '儀器預約',
                        {
                            confirmButtonText: '確認預約',
                            cancelButtonText: '取消預約',
                            type: 'warning',
                            distinguishCancelAndClose: true
                        }
                    )
                    method = 'reserve';
                }
                catch(e){
                    if(e == 'cancel') method = 'cancel';
                    else return
                }

                const res = await axios.post('/api/reservation/user/handleReserve',
                    {   
                        targetEquipment: props.targetEquipment, reserveId: reserve?.reserveId, 
                        method, reserve_date: date, reserve_period: period
                    },
                    {
                        headers: {
                            'x-user-token': jsCookie.get('authToken')
                        }
                    }
                );

                eventBus.emit('handleAlert', { title:'儀器預約結果', message: res.data.message, type: res.data.type })
                await getData();
            }
            catch(e){}
        }

        let timer = null;

        onMounted(()=>{
            timer = setInterval(async() => {
                if(props.targetEquipment) await getData();
            }, 5000);
        })

        onUnmounted(()=>{
            if(timer){
                clearInterval(timer);
                timer = null;
            }
        })

        watch(()=> props.targetEquipment, async ()=>{
            if(props.targetEquipment) await getData();
        },
        { immediate: true, deep: true })

        return {
            date, getData, reservationData, handle, periodList, getPeriod, getPeriodLabel, isPast, UserIcon
        }
    }
}
</script>

<style scoped>
    .calendar-wrapper{
        width: 100%;
        margin-top: 20px;
        height: calc(100vh - 200px);
        display: flex;
        box-sizing: border-box;
        gap: 10px;
    }
    .calendar-item-wrapper-all{
        width: calc(100% / 7);
        height: 100%;
        box-sizing: border-box;
    }
    .calendar-item-title{
        background: white;
        height: 30px;
        line-height: 30px;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .calendar-item-wrapper{
        width: 100%;
        height: calc(100% - 35px);
        margin-top: 10px;
        overflow-y: scroll;
        box-sizing: border-box;
        padding: 3px;
    }
    .calendar-item{
        width: 100%;
        font-size: 12px;
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border-radius: 35px;
        margin-bottom: 10px;
        box-shadow: 0 0 3px rgba(0,0,0,0.12);
        transition: background 0.75s ease;
        background: white;
        position: relative;
    }
    .calendar-item:hover{
        cursor: pointer;
        background: black;
        color: white;
    }

    /* 禁用中 */
    .calendar-item-status--1{
        background: transparent;
        color: black;
        box-shadow: none;
    }
    .calendar-item-status--1:hover{
        cursor: not-allowed;
        background: transparent;
        color: black
    }

    /* 已預約 */
    .calendar-item-status-1{
        background: rgba(170,170,170);
        color: white;
    }
    /* 已簽到 */
    .calendar-item-status-2{
        background: rgba(170,170,170);
        color: white;
    }
    /* 逾時簽到 */
    .calendar-item-status-3{
        background: rgba(170,170,170);
        color: white;
    }

    /* 個人預約 */
    .calendar-item-status-is-Mine{
        background: black;
        color: white;
    }
    .calendar-item-is-Mine{
        position: absolute;
        right: 20px;
    }

    @media screen and (max-width:1032px) {
        .calendar-item-is-Mine{
            display: none;
        }
    }

</style>