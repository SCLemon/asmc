<template>
    <div>
        <div class="cloud-navigatior-wrapper" ref="historyWrapper">
            <div class="cloud-navigatior-history-list">
                <div v-for="(item, id) in historyList" :key="id" class="cloud-navigatior-history-item-wrapper">
                    <VIcon :icon="ChevronRightIcon" :size="16" v-if="id" :style="{color: (id == (historyList.length - 1)) ? 'black':'rgba(0,0,0,0.2)'}"></VIcon>
                    <div class="cloud-navigatior-history-item" @click="goTo(item.token)" :class="{ 'cloud-navigatior-history-item-selected': id == (historyList.length - 1)}">{{ item.label }}</div>
                </div>
            </div>
            <div class="cloud-add-button" @click="showAddList = true" ref="addButtonWrapper">
                <div class="cloud-add-button-text"><VIcon :icon="PlusIcon"></VIcon>新增</div>
                <div class="cloud-add-button-list-wrapper" v-if="showAddList" >
                    <div class="cloud-add-button-list-item" @click="openCreateNewFolder">
                        <div class="cloud-add-button-list-item-icon"><VIcon :icon="PlusIcon"></VIcon></div>
                        <div class="cloud-add-button-list-item-title">新資料夾</div>
                    </div>
                    <div class="cloud-add-button-list-item" @click="openUploadFiles">
                        <div class="cloud-add-button-list-item-icon"><VIcon :icon="FileIcon"></VIcon></div>
                        <div class="cloud-add-button-list-item-title">檔案上傳</div>
                    </div>
                    <div class="cloud-add-button-list-item" @click="openUploadFolders">
                        <div class="cloud-add-button-list-item-icon"><VIcon :icon="FolderIcon"></VIcon></div>
                        <div class="cloud-add-button-list-item-title">資料夾上傳</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="cloud-navigatior-stage">
            <folder-list v-if="folderList.length" :folder-list="folderList"></folder-list>
            <file-list v-if="fileList.length" :file-list="fileList"></file-list>
        </div>
        <input ref="inputFileEl" type="file" name="" id="" multiple @change="handleUploadFiles" style="display: none;">
        <input ref="inputFolderEl" type="file" webkitdirectory @change="handleUploadFolder" style="display: none;"/>
    </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';

import FolderList from './components/FolderList.vue';
import FileList from './components/FileList.vue';

import { computed, ref, nextTick, watch, onMounted, onUnmounted } from 'vue';

import { VIcon } from 'vorium-ui'
import { ChevronRightIcon, PlusIcon, FolderIcon, FileIcon, UploadIcon } from 'vorium-ui/icons'
import 'vorium-ui/icons/icons.css'

import axios from 'axios'
import jsCookie from 'js-cookie'
import { ElMessageBox } from 'element-plus'
import { eventBus } from '@/utils/eventBus.js';

import { useCloudUploadFiles } from './hooks/useCloudUploadFiles'
import { useCloudUploadFolders } from './hooks/useCloudUploadFolders.js'


export default {
    name: 'Cloud',
    components:{
        FileList, FolderList, VIcon
    },
    setup(){

        const router = useRouter();
        const route = useRoute();

        const historyWrapper = ref(null)
        const addButtonWrapper = ref(null);

        const historyList = ref([{ label:'ASMC 雲端硬碟', token:'' }]);
        const folderList = ref([])
        const fileList = ref([]);

        const showAddList = ref(false)
        
        const currentParent = computed(()=>{
            return route.params.token ?? '';
        })


        onMounted(async()=>{
            document.addEventListener('click', handleClickOutside);
            eventBus.on('refreshCloudData', getData);
            
            scrollToRight()
            await getData()
        })
        onUnmounted(()=>{
            document.removeEventListener('click', handleClickOutside);
        });

        function goTo(token){
            router.replace(`/cloud/${token}`).catch(e=>{});
        }

        // 獲取當前資料夾
        async function getData(){

            const res = await axios.post('/api/cloud/user/getData',{
                parent:currentParent.value
            },
            {
                headers:{
                    'x-user-token':jsCookie.get('authToken')
                }
            })

            historyList.value = res.data.historyList;
            folderList.value = res.data.data?.folders ?? [];
            fileList.value = res.data.data?.files ?? [];

            if(res.data.type == 'error'){
                eventBus.emit('handleAlert',{ title:'雲端資料獲取結果', message:res.data.message, type:res.data.type })
            }

        }


        // 上傳檔案
        const { inputFileEl, openUploadFiles, handleUploadFiles } = useCloudUploadFiles(currentParent, getData)


        // 上傳資料夾
        const { inputFolderEl, uploadList, createFolder, openUploadFolders, handleUploadFolder } = useCloudUploadFolders(currentParent, getData)

        // 創建新資料夾
        async function openCreateNewFolder(){
            try{
                const { value } = await ElMessageBox.prompt('請輸入資料夾名稱', '創建資料夾', {
                    confirmButtonText: '創建', cancelButtonText: '取消',
                })
                
                if(value && (value.trim()).length){
                    const result = await createFolder(value, currentParent.value);
                    eventBus.emit('handleAlert', { title:'創建資料夾結果', message: result.message, type: result.type })
                }
                else eventBus.emit('handleAlert', { title:'創建資料夾結果', message: '資料夾名稱不可為空', type: 'error' })
            }
            catch(e){
                console.log(e)
            }
            finally{
                showAddList.value = false;
                await getData();
            }
        }


        // blur 時，自動關閉 AddList
        function handleClickOutside(event){

            if(addButtonWrapper.value && !addButtonWrapper.value.contains(event.target)){
                showAddList.value = false;
            }
        }


        // 路徑條滾動
        const scrollToRight = async () => {

            await nextTick()

            const el = historyWrapper.value

            if(!el) return

            el.scrollTo({ left:el.scrollWidth, behavior:'smooth' })

        }


        watch(historyList,()=>{
            scrollToRight()
        },{ deep:true, immediate:true })


        watch(currentParent, async()=>{
            await getData();
        }, { deep: true })

        return {
            inputFileEl,
            inputFolderEl,
            historyWrapper,
            historyList,
            uploadList,
            ChevronRightIcon,
            PlusIcon,
            createFolder,
            openUploadFiles,
            handleUploadFiles,
            openUploadFolders,
            handleUploadFolder,
            folderList,
            fileList, addButtonWrapper,
            goTo, showAddList, openCreateNewFolder,
            FolderIcon, FileIcon, UploadIcon
        }

    }
}
</script>

<style scoped>
    .cloud-navigatior-wrapper{
        width: 100%;
        overflow: hidden;
        position: relative;
        padding-left: 25px;
        padding-right: 550px;
        box-sizing: border-box;
        height: 80px;
        box-shadow: 0px 3px 3px rgba(0,0,0,0.12);
        display: flex;
        align-items: center;
    }

    .cloud-navigatior-history-list {
        display: flex;
        align-items: center;
        white-space: nowrap;
        flex-wrap: nowrap;
    }
    .cloud-navigatior-history-item{
        padding-left: 15px;
        padding-right: 15px;
        color: rgba(0,0,0,0.2);
        flex-shrink: 0;
        transition: all 0.25s ease;
    }
    .cloud-navigatior-history-item:hover{
        cursor: pointer;
        color: black;
    }
    .cloud-navigatior-history-item-wrapper{
        display: flex;
        align-items: center;
    }
    .cloud-navigatior-history-item-selected{
        color: black;
        font-weight: bolder;
    }
    .cloud-add-button{
        width: 95px;
        height: 50px;
        position: fixed;
        right: 30px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 5px rgba(0,0,0,0.2);
        background: white;
        transition: box-shadow 0.3s ease;
        z-index: 1;
    }
    .cloud-add-button-text{
        display: flex;
        align-items: center;
        gap: 5px;
    }
    .cloud-add-button:hover{
        cursor: pointer;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
    }
    .cloud-add-button-list-wrapper{
        width: 200px;
        box-sizing: border-box;
        height: fit-content;
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        background: white;
        border-radius: 5px;
        box-shadow: 0 0 3px rgba(0,0,0,0.2);
        overflow: hidden;
    }
    .cloud-add-button-list-item{
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        font-size: 14px;
    }
    .cloud-add-button-list-item-icon{
        width: 40px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .cloud-add-button-list-item-title{
        width: 100%;
    }
    .cloud-add-button-list-item:hover{
        cursor: pointer;
        background: rgba(0,0,0,0.03);
    }
    .cloud-navigatior-stage{
        width: 100%;
        height: calc(100vh - 80px);
        overflow-y: scroll;
    }
</style>