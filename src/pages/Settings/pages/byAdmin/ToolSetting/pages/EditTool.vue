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
                <el-input type="textarea" v-model="tool.abstract" style="width: 100%;" clearable placeholder="Enter Abstract" />
            </div>
        </div>
        <div class="tool-setting-edit-input-title" v-if="method != 'add'">工具圖示：</div>
        <div class="tool-setting-edit-icon-wrapper" @click="openUploadIcon()" v-if="method != 'add'">
            <img :src="tool.imgUrl || '/logo/logo.png'" alt="">
            <div class="tool-setting-edit-icon-wrapper-mask">
                <VIcon :icon="PlusIcon" :size="40" style="color: white;"></VIcon>
            </div>
            <input type="file" ref="iconFileRef" @change="uploadIcon()" style="display: none;" accept="image/*">
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


import { VIcon } from 'vorium-ui'
import { PlusIcon } from 'vorium-ui/icons'
import 'vorium-ui/icons/icons.css'

import { compressImage } from '../../../../../../utils/compressor';

export default {
    name: 'EditMember',
    components:{
        VIcon
    },
    setup(){
        
        const router = useRouter();
        const route = useRoute();
        
        const method = route.query.method;
        const targetTool = route.query.targetTool;
        const iconFileRef = ref();

        const tool = ref({
            name: '',
            version: '',
            author: '',
            abstract: '',
            imgUrl: '',
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

        function openUploadIcon(){
            iconFileRef.value.click();
        }

        async function uploadIcon(){
            const file = iconFileRef.value?.files?.[0];
            if (!file) return;

            const formData = new FormData();

            const compressedImage = await compressImage(file, 200, 75);

            formData.append('file', compressedImage);
            formData.append('targetTool', targetTool);

            try {
                const res = await axios.post('/api/toolSetting/admin/uploadIcon', formData, {
                    headers: {
                        'x-user-token': jsCookie.get('authToken'),
                        'Content-Type': 'multipart/form-data'
                    }
                });

                eventBus.emit('handleAlert', { title: '圖示上傳資訊', message: res.data.message, type: res.data.type });

                if (res.data.type === 'success') tool.value.imgUrl = res.data.data.imgUrl;
            } 
            catch (e) {
                eventBus.emit('handleAlert', { title: '圖示上傳失敗', message: '伺服器錯誤，請稍後再試。', type: 'error' });
            } 
            finally {
                iconFileRef.value.value = '';
            }
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
            method, tool, send, goBack, freeze, PlusIcon, iconFileRef, openUploadIcon, uploadIcon
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
    .tool-setting-edit-icon-wrapper{
        margin-top: 25px;
        width: 150px;
        height: 150px;
        border: 1px dashed rgba(0,0,0, 0.3);
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .tool-setting-edit-icon-wrapper>img{
        width: 100%;
    }
    .tool-setting-edit-icon-wrapper-mask{
        width: 100%;
        height: 100%;
        position: absolute;
        top:0;
        left:0;
        background: rgba(0,0,0,0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    .tool-setting-edit-icon-wrapper-mask:hover{ 
        cursor: pointer;
    }
    .tool-setting-edit-icon-wrapper:hover .tool-setting-edit-icon-wrapper-mask{
        opacity: 1;
    }
</style>