<template>
    <div class="file-list-wrapper">
        <div class="file-item" v-for="(file, id) in fileList" :key="id" @dblclick="preview(file.token)" @touchend="handleTouchEnd($event, file.token)">
            <div class="file-item-icon"><VIcon :icon="FileIcon" :size="16"></VIcon></div>
            <div class="file-item-title">{{ file.name }}</div>
            <div class="file-item-size">{{ ((file?.file?.size) / 1024).toFixed(1) }} KB</div>
            <div class="file-item-createTime">{{ file.createTime }}</div>
            <div class="file-item-createTime-mobile">{{ (file.createTime)?.split(' ')[0] }}</div>
            <div class="file-item-more" @click.stop="openTargetFileMoreList(file.token)" @touchend.stop>
                <VIcon :icon="MoreVerticalIcon" :size="16"></VIcon>
                <MoreList v-if="activeMoreToken == file.token" :token="file.token" @close="activeMoreToken = null" :source="file"></MoreList>
            </div>
        </div>
    </div>
    <div class="file-list-preview-wrapper" v-if="openPreview">
        <FilePreview @click.stop v-if="currentPreviewUrl" :url="currentPreviewUrl" @close-preview="openPreview = false"/>
    </div>
</template>

<script>
import { VIcon } from 'vorium-ui'
import { FileIcon, MoreVerticalIcon } from 'vorium-ui/icons'
import 'vorium-ui/icons/icons.css'
import MoreList from './components/MoreList.vue';

import { ref } from 'vue'
import FilePreview from './components/FilePreview.vue'

export default {
    name: 'FileList',
    props:{
        fileList:{
            type: Array,
            default: []
        }
    },
    components:{
        VIcon, MoreList, FilePreview
    },
    setup(){

        const activeMoreToken = ref(null);
        let lastTouchTime = 0;
        let lastTouchToken = null;

        function handleTouchEnd(event, token) {
            const currentTime = Date.now();

            // 300ms 內再次點擊同一個項目，視為雙擊
            if (
                currentTime - lastTouchTime < 300 &&
                lastTouchToken === token
            ) {
                event.preventDefault();

                lastTouchTime = 0;
                lastTouchToken = null;

                preview(token);
            } else {
                lastTouchTime = currentTime;
                lastTouchToken = token;
            }
        }

        function openTargetFileMoreList(token){

            if(activeMoreToken.value === token) activeMoreToken.value = null;
            else activeMoreToken.value = token;

        }

        const openPreview = ref(false)
        const currentPreviewUrl = ref('');
        async function preview(token){
            window.getSelection()?.removeAllRanges();
            openPreview.value = true;
            currentPreviewUrl.value = `/api/cloud/user/download/${token}`;
        }

        return {
            activeMoreToken, handleTouchEnd, FileIcon, MoreVerticalIcon, openTargetFileMoreList, preview, currentPreviewUrl, openPreview
        }
    }
}
</script>

<style scoped>

    .file-list-wrapper{
        width: 100%;
        box-sizing: border-box;
        margin-top: 5px;
    }

    .file-item{
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding-left: 25px;
        padding-right: 25px;
        border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    .file-item:hover{
        cursor: pointer;
        background: rgba(0,0,0,0.03);
    }
    .file-item-icon{
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
    }
    .file-item-title{
        width: 100%;
        height: 30px;
        line-height: 30px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-left: 15px;
        margin-right: 15px;
        user-select: none;
    }
    .file-item-size{
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: right;
        flex-shrink: 0;
        font-size: 14px;
        color: rgba(0,0,0,0.2);
        margin-right: 30px;
    }
    .file-item-createTime, .file-item-createTime-mobile{
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: right;
        flex-shrink: 0;
        margin-right: 15px;
        font-size: 14px;
        color: rgba(0,0,0,0.2);
    }
    
    .file-item-createTime-mobile{
        display: none;
    }

    .file-item-more{
        width: 30px;
        height: 30px;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        position: relative;
    }
    .file-item-more:hover{
        cursor: pointer;
        background: rgba(0,0,0,0.05);
    }
    .file-list-preview-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        background-color: rgba(0,0,0,0.85);
    }
    @media screen and (max-width: 500px) {
        .file-item-size{
            display: none;
        }
        .file-item-createTime{
            display: none;
        }
        .file-item-createTime-mobile{
            display: flex;
        }
    }
</style>