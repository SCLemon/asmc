<template>
    <div class="cloud-more-button-list-wrapper">
        <div class="cloud-more-button-list-item" @click="download()">
            <div class="cloud-more-button-list-item-icon"><VIcon :icon="DownloadIcon"></VIcon></div>
            <div class="cloud-more-button-list-item-title">下載</div>
        </div>
        <div class="cloud-more-button-list-item" @click="rename()">
            <div class="cloud-more-button-list-item-icon"><VIcon :icon="EditIcon"></VIcon></div>
            <div class="cloud-more-button-list-item-title">重新命名</div>
        </div>
        <div class="cloud-more-button-list-item" @click.stop="openMove()">
            <div class="cloud-more-button-list-item-icon"><VIcon :icon="SendIcon"></VIcon></div>
            <div class="cloud-more-button-list-item-title">移動</div>
        </div>

        <div class="cloud-more-button-list-item" @click="remove()">
            <div class="cloud-more-button-list-item-icon"><VIcon :icon="TrashIcon"></VIcon></div>
            <div class="cloud-more-button-list-item-title">刪除</div>
        </div>
        <el-dialog v-model="openMoveDialog" title="移動至" width="80%">
            <el-tree style="width: 100%" :data="structure" :props="structureProps" @node-click="handleSelected" node-key="id" :current-node-key="0" :default-expanded-keys="[0]" highlight-current/>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleCanceled()">取消</el-button>
                    <el-button type="primary" @click="move()">移動</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { VIcon } from 'vorium-ui'
import { DownloadIcon, TrashIcon, EditIcon, SendIcon  } from 'vorium-ui/icons'
import 'vorium-ui/icons/icons.css'

import { ElMessageBox, ElNotification } from 'element-plus'
import { eventBus } from '@/utils/eventBus.js';

import jsCookie from 'js-cookie'
import axios from 'axios'

import { ref, h } from 'vue'

export default {
    name: 'MoreList',
    props:{
        token: {
            type: String,
            default: ''
        },
        source: {
            type: Object,
            default: {}
        }
    },
    components:{
        VIcon,
    },
    setup(props, context){


        async function rename(){

            try{
                const { value } = await ElMessageBox.prompt('', '重新命名', {
                    confirmButtonText: '更改', cancelButtonText: '取消', inputValue: props.source?.name ?? ''
                })
                
                if(value && (value.trim()).length){
                    const res = await axios.put('/api/cloud/user/rename',{
                        targetCloud: props.token, name: value 
                    },
                    {
                        headers:{
                            'x-user-token':jsCookie.get('authToken')
                        }
                    })
                    eventBus.emit('handleAlert', { title:'重新命名結果', message: res.data.message, type: res.data.type })
                    
                }
                else eventBus.emit('handleAlert', { title:'重新命名結果', message: '名稱不可為空', type: 'error' })

            }
            catch(e){
                console.log(e)
            }
            finally{
                context.emit('close')
                eventBus.emit('refreshCloudData')
            }
            
        }

        async function remove(){

            try{
                await ElMessageBox.confirm('確認永久刪除該資源？', '刪除資源', {
                    confirmButtonText: '刪除', cancelButtonText: '取消',
                })
                const res = await axios.put('/api/cloud/user/delete',{ targetCloud: props.token },
                {
                    headers:{
                        'x-user-token':jsCookie.get('authToken')
                    }
                })
                eventBus.emit('handleAlert', { title:'資源刪除結果', message: res.data.message, type: res.data.type })

            }
            catch(e){
                console.log(e)
            }
            finally{
                context.emit('close')
                eventBus.emit('refreshCloudData')
            }
            
        }

                
        async function download() {

            const downloadText = ref('資源正在下載中 (0%)...')

            const notification = ElNotification({ 
                title: '資源下載進度', 
                message: () => h('span', downloadText.value), 
                type: 'warning', 
                showClose:false, 
                duration: 0, 
                position: 'bottom-right' 
            })

            try {
                
                const res = await axios.get(`/api/cloud/user/download/${props.token}`,
                    {
                        headers: {
                            'x-user-token': jsCookie.get('authToken')
                        },

                        responseType: 'blob',

                        onDownloadProgress: (event) => {

                            if (event.total) {

                                const percent = Math.round((event.loaded / event.total) * 100)

                                downloadText.value = `資源正在下載中 (${percent}%)...`

                            }
                            else {

                                const loadedMB = (event.loaded / (1024 * 1024)).toFixed(1)

                                downloadText.value = `資源正在下載中 (${loadedMB} MB)...`

                            }

                        }
                    }
                );


                const contentDisposition = res.headers['content-disposition'];
                let fileName = 'download';


                if (contentDisposition) {

                    // 優先處理 UTF-8 中文檔名
                    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/);


                    // 一般 filename
                    const normalMatch = contentDisposition.match(/filename="?([^"]+)"?/);


                    if (utf8Match?.[1]) {

                        fileName = decodeURIComponent(utf8Match[1]);

                    } 
                    else if (normalMatch?.[1]) {

                        fileName = normalMatch[1];

                    }

                }

                const blob = new Blob([res.data],
                    {
                        type: res.headers['content-type']
                    }
                );


                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');

                link.href = blobUrl;
                // 保留原始名稱與副檔名
                link.download = fileName;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                link.remove();
                URL.revokeObjectURL(blobUrl);
                ElNotification({ title: '資源下載結果', message: '資源下載成功', type: 'success', position: 'bottom-right' })

            } 
            catch (e) {
                ElNotification({ title: '資源下載結果', message: '資源下載失敗', type: 'error', position: 'bottom-right' })
                console.error(e);
            }
            finally{
                notification.close();
            }

        }

        // 移動資料夾 Begin //
        const structure = ref([])
        const structureProps = { id: 'id', children: 'children', label: 'label', value: 'value' }
        const openMoveDialog = ref(false);
        const currentSelected = ref(null)

        function handleSelected(data){
            currentSelected.value = data.value
        }
        function handleCanceled(){
            currentSelected.value = null;
            openMoveDialog.value = false;
        }

        async function getStructure(){

            try{
                const res = await axios.get('/api/cloud/user/getStructure',
                {
                    headers:{
                        'x-user-token':jsCookie.get('authToken')
                    }
                })

                if(res.data.type == 'success') structure.value = res.data.data;

                if(res.data.type == 'error'){
                    eventBus.emit('handleAlert',{ title:'雲端資料結構獲取結果', message:res.data.message, type:res.data.type })
                }
            }
            catch(e){
                eventBus.emit('handleAlert',{ title:'雲端資料結構獲取結果',  message: '雲端資料結構獲取失敗', type: 'error'})
            }
        }

        async function openMove(){
            openMoveDialog.value = true;
            await getStructure();
        }

        async function move(){

            try{
                
                const res = await axios.put('/api/cloud/user/move',{
                    targetCloud: props.token, destination: currentSelected.value
                },
                {
                    headers:{
                        'x-user-token':jsCookie.get('authToken')
                    }
                })
                eventBus.emit('handleAlert', { title:'資料移動結果', message: res.data.message, type: res.data.type })

            }
            catch(e){
                console.log(e)
            }
            finally{
                context.emit('close')
                eventBus.emit('refreshCloudData')
            }
            
        }
        // 移動資料夾 End //

        return {
            DownloadIcon, TrashIcon, EditIcon, SendIcon, rename, remove, download, 
            openMoveDialog, openMove, structure, structureProps, handleSelected, handleCanceled, move
        }
    }
}
</script>

<style scoped>
    .cloud-more-button-list-wrapper{
        width: 200px;
        box-sizing: border-box;
        height: fit-content;
        background: white;
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        border-radius: 5px;
        box-shadow: 0 0 3px rgba(0,0,0,0.2);
        overflow: hidden;
        z-index: 2;
    }
    .cloud-more-button-list-item{
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        font-size: 14px;
        user-select: none;
    }
    .cloud-more-button-list-item-icon{
        width: 40px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .cloud-more-button-list-item-title{
        width: 100%;
    }
    .cloud-more-button-list-item:hover{
        cursor: pointer;
        background: rgba(0,0,0,0.03);
    }
    @media screen and (max-width:1032px) {
        .cloud-more-button-list-wrapper{
            top: calc(100% + 15px);
            width: 150px;
        }
    }
</style>