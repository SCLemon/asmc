<template>
    <div class="tool-setting-edit-wrapper">
        <div class="tool-setting-edit-header">
            <div class="tool-setting-edit-title">Tool Information</div>
            <div class="tool-setting-edit-right">
                <div class="tool-setting-edit-button"><el-button @click="send()" type="primary">儲存資訊</el-button></div>
                <div class="tool-setting-edit-button" v-if="method != 'add'"><el-button @click="freeze()" type="warning">{{tool.status ? '隱藏工具': '公開工具'}}</el-button></div>
                <div class="tool-setting-edit-button"><el-button @click="goBack()">返回列表</el-button></div>
            </div>
        </div>
        <div class="tool-setting-edit-table-wrapper">
            <div class="tool-setting-edit-input-wrapper">
                <div class="tool-setting-edit-input-title">名稱：</div>
                <el-input v-model="tool.name" style="width: 100%; height: 40px;" clearable placeholder="Enter App Name"/>
            </div>
            <div class="tool-setting-edit-input-wrapper">
                <div class="tool-setting-edit-input-title">版本：</div>
                <el-input v-model="tool.version" clearable style="width: 100%; height: 40px;" placeholder="Enter Version as v1.0.0.0 or @2026.10.10" />
            </div>
            <div class="tool-setting-edit-input-wrapper">
                <div class="tool-setting-edit-input-title">作者：</div>
                <el-input v-model="tool.author" style="width: 100%; height: 40px;" clearable placeholder="Enter Author Name" />
            </div>
            <div class="tool-setting-edit-input-wrapper">
                <div class="tool-setting-edit-input-title">介紹：</div>
                <el-input type="textarea" v-model="tool.abstract" style="width: 100%; height: 40px;" clearable placeholder="Enter Abstract" />
            </div>
        </div>
    </div>
</template>

<script>
import jsCookie from 'js-cookie';
import axios from 'axios';
import { eventBus } from '@/utils/eventBus';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus'


export default {
    name: 'EditMember',
    setup(){
        
        const router = useRouter();
        const route = useRoute();
        
        const method = route.query.method;
        const targetTool = route.query.targetTool;

        const tool = ref({
            name: '',
            version: '',
            author: '',
            abstract: '',
            status: true,
        })

        onMounted(async ()=>{
            await getData();
        })

        async function getData(){
            const res = await axios.post('/api/toolSetting/admin/getSpecificData',{ targetTool },{
                headers:{
                    'x-user-token': jsCookie.get('authToken')
                }
            })
            tool.value = res.data.data || {};
            
            if(res.data.type == 'error') eventBus.emit('handleAlert', { title:'工具資料獲取結果', message: res.data.message, type: res.data.type })
        }

        async function send(){
            if(method == 'add') await register();
            else if(method == 'revise') await revise();
            else eventBus.emit('handleAlert', { title:'執行結果', message: '執行失敗（參數遺失）', type: 'error' })
        }

        async function register(){

            const res = await axios.post('/api/toolSetting/admin/register', tool.value,
            {
                headers: {
                    'x-user-token': jsCookie.get('authToken')
                }
            })

            eventBus.emit('handleAlert', { title:'工具註冊資訊', message: res.data.message, type: res.data.type })
            
            if(res.data.type == 'success') goBack();
        }

        async function freeze(){
            try{
                await ElMessageBox.confirm('確認公開/隱藏工具？', '修改權限',
                    {
                        confirmButtonText: '確認',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )
                const res = await axios.put('/api/toolSetting/admin/freeze',{ targetTool },{
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                })
                eventBus.emit('handleAlert', { title:'工具狀態修改', message: res.data.message, type: res.data.type })
                await getData();
            }
            catch(e){
                
            }
        }

        async function revise(){
            const input = {
                targetTool,
                ...tool.value
            }
            const res = await axios.post('/api/toolSetting/admin/revise', input,
            {
                headers: {
                    'x-user-token': jsCookie.get('authToken')
                }
            })

            eventBus.emit('handleAlert', { title:'工具資料修改結果', message: res.data.message, type: res.data.type })
            await getData();
        }

        function goBack(){
            const redirect = route.query.redirect || '/settings/admin/tool-setting'
            router.replace(redirect).catch((e)=>{})
        }

        return {
            method, tool, send, goBack, freeze
        }
    }
}
</script>

<style scoped>
    .tool-setting-edit-wrapper{
        width: 100%;
        height: 100vh;
        box-sizing: border-box;
        padding-left: 20px;
        padding-right: 20px;
    }
    .tool-setting-edit-header{
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
    }
    .tool-setting-edit-title{
        font-size: 24px;
        font-weight: bolder;
    }
    .tool-setting-edit-right{
        margin-left: auto;
        display: flex;
        align-items: center;
        width: fit-content;
        gap: 10px;
    }
    .tool-setting-edit-button>.el-button{
        padding: 20px 15px 20px 15px;
    }

    .tool-setting-edit-table-wrapper{
        width: 100%;
        margin-top: 15px;
    }
    .tool-setting-edit-input-wrapper{
        width: 100%;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        margin-bottom: 20px;
        gap:20px;
    }
    .tool-setting-edit-input-title{
        flex-shrink: 0;
    }
    :deep(.el-select__wrapper){
        height: 40px;
    }
</style>