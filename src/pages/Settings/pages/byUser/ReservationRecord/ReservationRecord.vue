<template>
  <div class="reservation-record-wrapper">
    <div class="reservation-record-header">
        <div class="reservation-record-title">Reservation Record</div>
        <div class="reservation-record-right">
            <div class="reservation-record-search">
                <input class="reservation-record-search-input" type="text" name="" id="" placeholder="Search by equipment name" v-model="keyword">
                <div class="reservation-record-search-input-icon"><VIcon :icon="SearchIcon"></VIcon></div>
            </div>
        </div>
    </div>
    <div class="reservation-record-table">
        <ReservationTable :keyword="keyword"></ReservationTable>
    </div>
  </div>
</template>

<script>


import ReservationTable from './components/ReservationTable.vue';

import { ref } from 'vue';
import { VIcon } from 'vorium-ui'
import { SearchIcon } from 'vorium-ui/icons'
import 'vorium-ui/icons/icons.css'


export default {
    name: 'ReservationRecord',
    components:{
       ReservationTable, VIcon
    },
    setup(){
        const keyword = ref('');

        return {
            SearchIcon, keyword
        }
    }
}
</script>

<style scoped>
    .reservation-record-wrapper{
        width: 100%;
        height: 100vh;
        box-sizing: border-box;
        padding-left: 20px;
        padding-right: 20px;
    }
    .reservation-record-header{
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
    }
    .reservation-record-title{
        font-size: 24px;
        font-weight: bolder;
    }
    .reservation-record-right{
        margin-left: auto;
        display: flex;
        align-items: center;
        width: fit-content;
    }
    .reservation-record-search{
        width: 280px;
        height: 40px;
        box-sizing: border-box;
        border: 0;
        border-bottom: 1px solid rgba(0,0,0,0.12);
        display: flex;
        align-items: center;
    }
    .reservation-record-search-input{
        width: calc(100% - 40px);
        height: 38px;
        box-sizing: border-box;
        padding-left: 5px;
        border: 0;
    }
    .reservation-record-search-input:focus{
        outline: 0;
    }
    .reservation-record-search-input-icon{
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .reservation-record-button>.el-button{
        padding: 20px 15px 20px 15px;
    }
    .reservation-record-table{
        height: calc(100% - 80px);
        overflow: hidden;
    }
</style>