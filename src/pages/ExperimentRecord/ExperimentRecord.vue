<template>
  <div class="experiment-record-wrapper">
    <div class="experiment-record-header">
        <div class="experiment-record-group">
            <el-radio-group v-model="group" size="large" fill="black">
                <el-radio-button label="My Recipes" :value="1" />
                <el-radio-button label="Full Database" :value="2" />
            </el-radio-group>
        </div>
        <div class="experiment-record-right">
            <div class="experiment-record-search">
                <input class="experiment-record-search-input" type="text" name="" id="" placeholder="Search recipe by name or owner" v-model="keyword">
                <div class="experiment-record-search-input-icon"><VIcon :icon="SearchIcon"></VIcon></div>
            </div>
            <div class="experiment-record-button"><el-button @click="register()">新增計畫</el-button></div>
        </div>
    </div>
    <div class="experiment-record-table">
        <ExperimentTable ref="ExperimentTableRef" :keyword="keyword" :group="group"></ExperimentTable>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import ExperimentTable from './components/ExperimentTable.vue';

import { ref } from 'vue';
import { eventBus } from '@/utils/eventBus.js';
import jsCookie from 'js-cookie';

import { VIcon } from 'vorium-ui'
import { SearchIcon } from 'vorium-ui/icons'
import 'vorium-ui/icons/icons.css'

import { ElMessage, ElMessageBox } from 'element-plus'

export default {
    name: 'ExperimentRecord',
    components:{
        ExperimentTable, VIcon
    },
    setup(){
        const ExperimentTableRef = ref(null)
        const keyword = ref('');
        const group = ref(1)

        async function register(){

            try{
                const { value } = await ElMessageBox.prompt('請輸入實驗計畫名稱', '新增計畫', {
                    confirmButtonText: '確認',
                    cancelButtonText: '取消',
                })

                const res = await axios.post('/api/experimentRecords/user/register',{
                    name: value
                },
                {
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                })

                eventBus.emit('handleAlert', { title:'實驗計畫註冊資訊', message: res.data.message, type: res.data.type })
                
                await ExperimentTableRef.value.getData();
            }
            catch(e){}

        }
        return {
            ExperimentTableRef, register, SearchIcon, keyword, group
        }
    }
}
</script>

<style scoped>
    .experiment-record-wrapper{
        width: 100%;
        height: 100vh;
        box-sizing: border-box;
        padding-left: 20px;
        padding-right: 20px;
    }
    .experiment-record-header{
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
    }
    .experiment-record-right{
        margin-left: auto;
        display: flex;
        align-items: center;
        width: fit-content;
    }
    .experiment-record-search{
        width: 250px;
        margin-right: 30px;
        height: 40px;
        box-sizing: border-box;
        border: 0;
        border-bottom: 1px solid rgba(0,0,0,0.12);
        display: flex;
        align-items: center;
    }
    .experiment-record-search-input{
        width: calc(100% - 40px);
        height: 38px;
        box-sizing: border-box;
        padding-left: 5px;
        border: 0;
    }
    .experiment-record-search-input:focus{
        outline: 0;
    }
    .experiment-record-search-input-icon{
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .experiment-record-button>.el-button{
        padding: 20px 15px 20px 15px;
    }
    .experiment-record-table{
        height: calc(100% - 80px);
        overflow: hidden;
    }
    @media screen and (max-width: 500px) {
        .experiment-record-header{
            flex-direction: column;
            margin-top: 20px;
            margin-bottom: 15px;
            gap:20px;
            height:auto;
        }
        .experiment-record-group{
            width: 100%;
        }
        .experiment-record-search{
            margin-right: 20px;
            justify-content: center;
        }
    }
</style>