<template>
  <div class="equipment-setting-wrapper">
    <div class="equipment-setting-header">
        <div class="equipment-setting-title">Equipment Reservation</div>
        <div class="equipment-setting-right">
            <div class="equipment-setting-search">
                <el-select v-model="selected" placeholder="Select Equipment" style="width: 100%;">
                    <el-option v-for="item in lists" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
            </div>
        </div>
    </div>
    <EquipmentReservation v-if="selected" :target-equipment="selected"></EquipmentReservation>
  </div>
</template>

<script>

import axios from 'axios';

import { ref, onMounted } from 'vue';
import { eventBus } from '@/utils/eventBus.js';
import jsCookie from 'js-cookie';

import { VIcon } from 'vorium-ui'
import { SearchIcon } from 'vorium-ui/icons'
import 'vorium-ui/icons/icons.css'

import { ElMessageBox } from 'element-plus'
import EquipmentReservation from './components/EquipmentReservation.vue';


export default {
    name: 'EquipmentSetting',
    components:{
         VIcon, EquipmentReservation
    },
    setup(){

        const selected = ref('')

        const lists = ref([])

        onMounted(async ()=>{
            await getData();
        })

        async function getData(){

            try{

                const res = await axios.get('/api/reservation/user/getData',
                {
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                })
                if(res.data.type == 'success') lists.value = res.data.data
            }
            catch(e){}

        }

        return {
            SearchIcon, selected, lists
        }
    }
}
</script>

<style scoped>
    .equipment-setting-wrapper{
        width: 100%;
        height: 100vh;
        box-sizing: border-box;
        padding-left: 20px;
        padding-right: 20px;
    }
    .equipment-setting-header{
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
    }
    .equipment-setting-title{
        font-size: 24px;
        font-weight: bolder;
    }
    .equipment-setting-right{
        margin-left: auto;
        display: flex;
        align-items: center;
        width: fit-content;
    }
    .equipment-setting-search{
        width: 500px;
        height: 40px;
        box-sizing: border-box;
        border: 0;
        display: flex;
        align-items: center;
    }
    .equipment-setting-button>.el-button{
        padding: 20px 15px 20px 15px;
    }
    .equipment-setting-table{
        height: calc(100% - 80px);
        overflow: hidden;
    }
    :deep(.el-select__wrapper){
        height: 40px;
    }
</style>