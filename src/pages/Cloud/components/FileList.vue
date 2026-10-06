<template>
    <div class="file-list-wrapper">
        <div class="file-item" v-for="(file, id) in fileList" :key="id" @dblclick="preview(file.token)">
            <div class="file-item-icon"><VIcon :icon="FileIcon" :size="16"></VIcon></div>
            <div class="file-item-title">{{ file.name }}</div>
            <div class="file-item-size">{{ ((file?.file?.size) / 1024).toFixed(1) }} KB</div>
            <div class="file-item-createTime">{{ file.createTime }}</div>
            <div class="file-item-more" @click.stop="openTargetFileMoreList(file.token)">
                <VIcon :icon="MoreVerticalIcon" :size="16"></VIcon>
                <MoreList v-if="activeMoreToken == file.token" :token="file.token" @close="activeMoreToken = null"></MoreList>
            </div>
        </div>
    </div>
</template>

<script>
import { VIcon } from 'vorium-ui'
import { FileIcon, MoreVerticalIcon } from 'vorium-ui/icons'
import 'vorium-ui/icons/icons.css'
import MoreList from './components/MoreList.vue';
import axios from 'axios'
import { ElNotification } from 'element-plus'

import { ref, h } from 'vue'
import jsCookie from 'js-cookie';

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

        async function preview(token) {

            const previewText = ref('資源預覽載入中 (0%)...')

            const notification = ElNotification({ 
                title: '資源預覽進度', 
                message: () => h('span', previewText.value), 
                type: 'warning', 
                showClose:false, 
                duration: 0, 
                position: 'bottom-right' 
            })
            
            try {

                const response = await axios.get(`/api/cloud/user/download/${token}`,
                    {
                        responseType: 'blob',
                        headers: {
                            'x-user-token': jsCookie.get('authToken')
                        },
                        onDownloadProgress: (event) => {

                            if (event.total) {

                                const percent = Math.round((event.loaded / event.total) * 100)

                                previewText.value = `資源預覽載入中 (${percent}%)...`

                            }
                            else {

                                const loadedMB = (event.loaded / (1024 * 1024)).toFixed(1)

                                previewText.value = `資源預覽載入中 (${loadedMB} MB)...`

                            }

                        }
                    }
                )

                const blobUrl = URL.createObjectURL(response.data)

                window.open(blobUrl, '_blank')
                ElNotification({ title: '資源預覽結果', message: '資源預覽成功', type: 'success', position: 'bottom-right' })

            } 
            catch (e){

                ElNotification({ title: '資源預覽結果', message: '資源預覽失敗', type: 'error', position: 'bottom-right' })

            }
            finally{

                notification.close();

            }

        }

        return {
            activeMoreToken, FileIcon, MoreVerticalIcon, openTargetFileMoreList, preview
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
        margin-right: 30px;
    }
    .file-item-createTime{
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: right;
        flex-shrink: 0;
        margin-right: 15px;
        font-size: 14px;
        color: rgba(0,0,0,0.2);
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