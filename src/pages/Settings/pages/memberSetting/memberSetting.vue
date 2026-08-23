<template>
  <div class="member-setting-wrapper">
    <div class="member-setting-header">
        <div class="member-setting-title">User Management</div>
        <div class="member-setting-right">
            <div class="member-setting-search">
                <input class="member-setting-search-input" type="text" name="" id="" placeholder="Search users by name" v-model="keyword">
                <div class="member-setting-search-input-icon"><VIcon :icon="SearchIcon"></VIcon></div>
            </div>
            <div class="member-setting-button"><el-button @click="register()">新增用戶</el-button></div>
        </div>
    </div>
    <div class="member-setting-table">
        <MemberTable ref="memberTableRef" :keyword="keyword"></MemberTable>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import MemberTable from './components/MemberTable.vue';

import { ref } from 'vue';
import { eventBus } from '@/utils/eventBus.js';
import jsCookie from 'js-cookie';

import { VIcon } from 'vorium-ui'
import { SearchIcon } from 'vorium-ui/icons'
import 'vorium-ui/icons/icons.css'

export default {
    name: 'MemberSetting',
    components:{
        MemberTable, VIcon
    },
    setup(){
        const memberTableRef = ref(null)
        const keyword = ref('');

        async function register(){

            const res = await axios.post('/api/memberSetting/register',{
                account: 'test' + new Date(), 
                password: 'test',
                level: '1',
                name: 'test'
            },
            {
                headers: {
                    'x-user-token': jsCookie.get('authToken')
                }
            })

            eventBus.emit('handleAlert', { title:'用戶註冊資訊', message: res.data.message, type: res.data.type })
            
            await memberTableRef.value.getData();

        }
        return {
            memberTableRef, register, SearchIcon, keyword
        }
    }
}
</script>

<style scoped>
    .member-setting-wrapper{
        width: 100%;
        height: 100vh;
        box-sizing: border-box;
        padding-left: 20px;
        padding-right: 20px;
    }
    .member-setting-header{
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
    }
    .member-setting-title{
        font-size: 24px;
        font-weight: bolder;
    }
    .member-setting-right{
        margin-left: auto;
        display: flex;
        align-items: center;
        width: fit-content;
    }
    .member-setting-search{
        width: 250px;
        margin-right: 30px;
        height: 40px;
        box-sizing: border-box;
        border: 0;
        border-bottom: 1px solid rgba(0,0,0,0.12);
        display: flex;
        align-items: center;
    }
    .member-setting-search-input{
        width: calc(100% - 40px);
        height: 38px;
        box-sizing: border-box;
        padding-left: 5px;
        border: 0;
    }
    .member-setting-search-input:focus{
        outline: 0;
    }
    .member-setting-search-input-icon{
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .member-setting-button>.el-button{
        padding: 20px 15px 20px 15px;
    }
    .member-setting-table{
        height: calc(100% - 80px);
        overflow: hidden;
    }
</style>