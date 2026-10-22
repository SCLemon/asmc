<template>
  <div class="tool-setting-wrapper">
    <div class="tool-setting-header">
        <div class="tool-setting-title">Tool Management</div>
        <div class="tool-setting-right">
            <div class="tool-setting-search">
                <input class="tool-setting-search-input" type="text" name="" id="" placeholder="Search tools by name" v-model="keyword">
                <div class="tool-setting-search-input-icon"><VIcon :icon="SearchIcon"></VIcon></div>
            </div>
            <div class="tool-setting-button"><el-button @click="goToRegisterPage">新增工具</el-button></div>
        </div>
    </div>
    <div class="tool-setting-table">
        <ToolTable ref="toolTableRef" :keyword="keyword"></ToolTable>
    </div>
  </div>
</template>

<script>


import ToolTable from './components/ToolTable.vue';

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { VIcon } from 'vorium-ui'
import { SearchIcon } from 'vorium-ui/icons'
import 'vorium-ui/icons/icons.css'


export default {
    name: 'MemberSetting',
    components:{
        ToolTable, VIcon
    },
    setup(){
        const toolTableRef = ref(null)
        const keyword = ref('');
        const router = useRouter();
        
        async function goToRegisterPage(){
            
            router.replace({
                path: '/settings/admin/tool-setting/edit',
                query: {
                    'method': 'add'
                }
            }).catch((e)=>{})

        }

        return {
            toolTableRef, goToRegisterPage, SearchIcon, keyword
        }
    }
}
</script>

<style scoped>
    .tool-setting-wrapper{
        width: 100%;
        height: 100vh;
        box-sizing: border-box;
        padding-left: 20px;
        padding-right: 20px;
    }
    .tool-setting-header{
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
    }
    .tool-setting-title{
        font-size: 24px;
        font-weight: bolder;
    }
    .tool-setting-right{
        margin-left: auto;
        display: flex;
        align-items: center;
        width: fit-content;
    }
    .tool-setting-search{
        width: 250px;
        margin-right: 30px;
        height: 40px;
        box-sizing: border-box;
        border: 0;
        border-bottom: 1px solid rgba(0,0,0,0.12);
        display: flex;
        align-items: center;
    }
    .tool-setting-search-input{
        width: calc(100% - 40px);
        height: 38px;
        box-sizing: border-box;
        padding-left: 5px;
        border: 0;
    }
    .tool-setting-search-input:focus{
        outline: 0;
    }
    .tool-setting-search-input-icon{
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .tool-setting-button>.el-button{
        padding: 20px 15px 20px 15px;
    }
    .tool-setting-table{
        height: calc(100% - 80px);
        overflow: hidden;
    }
</style>