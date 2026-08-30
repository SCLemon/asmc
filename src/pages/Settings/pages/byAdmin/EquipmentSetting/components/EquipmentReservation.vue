<template>
    <div>
        <el-date-picker v-model="date" type="daterange" single-panel style="width: 100%; box-sizing: border-box;"  readonly/>
        <div class="calendar-wrapper">
            <div class="calendar-item-wrapper-all" v-for="item in reservationData" :key="item.date">
                <div class="calendar-item-title">{{ item.title }}</div>
                <div class="calendar-item-wrapper">
                    <div class="calendar-item" v-for="period in periodList" :key="period" @click="handle(item.date, period)">{{ period }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { ref, watch } from 'vue';
import jsCookie from 'js-cookie';
import { eventBus } from '@/utils/eventBus.js';

export default {
    name: 'EquipmentReservation',
    props:{
        targetEquipment:{
            type: String,
            default: '',
        }
    },
    setup(props){
        const date = ref([new Date().getTime(), new Date().setDate(new Date().getDate() + 6)]);

        const periodList = Array.from({ length: 24 }, (_, i) => {
            return `${String(i).padStart(2, '0')}:00`;
        });

        const reservationData = ref([]);

        async function getData(){
            try{
                const res = await axios.post('/api/equipmentSetting/admin/getSpecificReservationData',{ targetEquipment: props.targetEquipment, date: date.value },{
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

        async function handle(date, period){
            try{
                // const res = await axios.post('/api/equipmentSetting/admin/getSpecificReservationData',{ targetEquipment: props.targetEquipment, date: date.value },{
                //     headers: {
                //         'x-user-token': jsCookie.get('authToken')
                //     }
                // });

                // reservationData.value = res.data.data;

                // if(res.data.type == 'error') eventBus.emit('handleAlert', { title:'儀器獲取資訊', message: res.data.message, type: res.data.type })
            }
            catch(e){
                console.log(e)
            }
        }

        
        
        watch(()=> props.targetEquipment, async ()=>{
            if(props.targetEquipment) await getData();
        },
        { immediate: true, deep: true })

        return {
            date, getData, periodList, reservationData, handle
        }
    }
}
</script>

<style scoped>
    .calendar-wrapper{
        width: 100%;
        margin-top: 20px;
        height: 300px;
        display: flex;
        box-sizing: border-box;
        gap: 10px;
    }
    .calendar-item-wrapper-all{
        width: calc(100% / 7);
        height: 300px;
        box-sizing: border-box;
    }
    .calendar-item-title{
        background: white;
        height: 30px;
        line-height: 30px;
        text-align: center;
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
    }
    .calendar-item:hover{
        cursor: pointer;
        background: black;
        color: white;
    }
</style>