<template>
  <div class="door-access-wrapper">
    <div class="door-access-header">
        <div class="door-access-title">Door Access Management</div>
        <div class="door-access-right">
            <div class="door-access-search">
                <el-select v-model="selected" placeholder="Select Controller" style="width: 100%;">
                    <el-option v-for="item in lists" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
            </div>
            <div class="door-access-polling-button"><el-button :type="polling? 'danger': 'primary'" @click="polling = !polling">{{ polling?  '停止輪詢': '自動輪詢'}}</el-button></div>
        </div>
    </div>
    <div class="door-access-table">
        <div class="door-access-table-item"><MemberTable :targetDevice="selected"></MemberTable></div>
        <div class="door-access-table-item"><EventTable :targetDevice="selected" :polling="polling"></EventTable></div>
    </div>
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

import MemberTable from './components/MemberTable.vue';
import EventTable from './components/EventTable.vue';


export default {
    name: 'EquipmentSetting',
    components:{
         VIcon, MemberTable, EventTable
    },
    setup(){

        const selected = ref('')

        const polling = ref(false);

        const lists = ref([])

        onMounted(async ()=>{
            await getData();
        })

        async function getData(){

            try{

                const res = await axios.get('/api/door-access-control/admin/getDevice',
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
            SearchIcon, selected, lists, polling
        }
    }
}
</script>

<style scoped>
    .door-access-wrapper{
        width: 100%;
        height: 100vh;
        box-sizing: border-box;
        padding-left: 20px;
        padding-right: 20px;
    }
    .door-access-header{
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
    }
    .door-access-title{
        font-size: 24px;
        font-weight: bolder;
    }
    .door-access-right{
        margin-left: auto;
        display: flex;
        align-items: center;
        width: fit-content;
    }
    .door-access-search{
        width: 250px;
        height: 40px;
        box-sizing: border-box;
        border: 0;
        display: flex;
        align-items: center;
        margin-right: 30px;
    }
    .door-access-polling-button>.el-button{
        padding: 20px 15px 20px 15px;
    }
    .door-access-table{
        height: calc(100% - 80px);
        overflow: hidden;
        display: flex;
        gap: 20px;
    }
    .door-access-table-item{
        width: 50%;
    }
    :deep(.el-select__wrapper){
        height: 40px;
    }
</style>