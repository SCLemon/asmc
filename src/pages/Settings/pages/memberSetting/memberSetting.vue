<template>
  <div class="member-setting-wrapper">
    <div class="member-setting-header">
        <div class="member-setting-title">User Management</div>
        <div class="member-setting-button"><el-button @click="register()">新增用戶</el-button></div>
    </div>
    <div class="member-setting-table">
        <MemberTable ref="memberTableRef"></MemberTable>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import MemberTable from './components/MemberTable.vue';

import { ref } from 'vue';
import { eventBus } from '@/utils/eventBus.js';
import jsCookie from 'js-cookie';
export default {
    name: 'MemberSetting',
    components:{
        MemberTable
    },
    setup(){
        const memberTableRef = ref(null)

        async function register(){

            const res = await axios.post('/api/memberSetting/register',{
                account: 'test', 
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
            memberTableRef, register
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
    .member-setting-button{
        margin-left: auto;
    }
    .member-setting-button>.el-button{
        padding: 20px 15px 20px 15px;
    }
    .member-setting-table{

    }
</style>