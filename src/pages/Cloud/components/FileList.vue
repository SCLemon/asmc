<template>
    <div class="file-list-wrapper">
        <div class="file-item" v-for="(file, id) in fileList" :key="id">
            <div class="file-item-icon"><VIcon :icon="FileIcon" :size="16"></VIcon></div>
            <div class="file-item-title">{{ file.name }}</div>
            <div class="file-item-size">{{ ((file?.file?.size) / 1024).toFixed(1) }} KB</div>
            <div class="file-item-more" @click.stop="openTargetFileMoreList(file.token)">
                <VIcon :icon="MoreVerticalIcon" :size="16"></VIcon>
                <MoreList v-if="activeMoreToken == file.token" :token="file.token" cu @close="activeMoreToken = null"></MoreList>
            </div>
        </div>
    </div>
</template>

<script>
import { VIcon } from 'vorium-ui'
import { FileIcon, MoreVerticalIcon } from 'vorium-ui/icons'
import 'vorium-ui/icons/icons.css'
import MoreList from './components/MoreList.vue';

import { ref } from 'vue'

export default {
    name: 'FileList',
    props:{
        fileList:{
            type: Array,
            default: []
        }
    },
    components:{
        VIcon, MoreList
    },
    setup(){

        const activeMoreToken = ref(null);

        function openTargetFileMoreList(token){

            if(activeMoreToken.value === token) activeMoreToken.value = null;
            else activeMoreToken.value = token;

        }

        return {
            activeMoreToken, FileIcon, MoreVerticalIcon, openTargetFileMoreList
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
    }
    .file-item-size{
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: right;
        flex-shrink: 0;
        font-size: 14px;
        color: rgba(0,0,0,0.2);
        margin-right: 15px;
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
</style>