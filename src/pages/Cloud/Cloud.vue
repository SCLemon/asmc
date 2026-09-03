<template>
    <div>
        <div class="cloud-navigatior-wrapper" ref="historyWrapper">
            <div class="cloud-navigatior-history-list">
                <div v-for="(item, id) in historyList" :key="id" class="cloud-navigatior-history-item-wrapper">
                    <VIcon :icon="ChevronRightIcon" :size="16" v-if="id" :style="{color: (id == (historyList.length - 1)) ? 'black':'rgba(0,0,0,0.2)'}"></VIcon>
                    <div class="cloud-navigatior-history-item" :class="{ 'cloud-navigatior-history-item-selected': id == (historyList.length - 1)}">{{ item.label }}</div>
                </div>
            </div>
            <div class="cloud-add-button" @click="openUploadFolders">
                <div class="cloud-add-button-text"><VIcon :icon="PlusIcon"></VIcon>新增</div>
            </div>
        </div>
        <dashboard :parent="''"></dashboard>
        <input ref="inputFileEl" type="file" name="" id="" multiple @change="handleUploadFiles" style="display: none;">
        <input ref="inputFolderEl" type="file" webkitdirectory multiple @change="handleUploadFolder" style="display: none;"/>
    </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import Dashboard from './components/Dashboard.vue';
import { computed, ref, nextTick, watch, onMounted } from 'vue';

import { VIcon } from 'vorium-ui'
import { ChevronRightIcon, PlusIcon } from 'vorium-ui/icons'
import 'vorium-ui/icons/icons.css'

import axios from 'axios'
import jsCookie from 'js-cookie'

import { useCloudUploadFiles } from './hooks/useCloudUploadFiles'
import { useCloudUploadFolders } from './hooks/useCloudUploadFolders.js'

export default {
    name: 'Cloud',
    components:{
        Dashboard, VIcon
    },
    setup(){

        const router = useRouter();
        const route = useRoute();

        const historyWrapper = ref(null)

        const historyList = ref([
            { label:'我的雲端硬碟', path:'' },
        ]);

        const currentParent = computed(()=>{
            return route.path.replace('/cloud','');
        })

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

            console.log(res.data.data)

            if(res.data.type == 'error'){
                eventBus.emit('handleAlert',{ title:'雲端資料獲取結果', message:res.data.message, type:res.data.type })
            }

        }


        // 上傳檔案
        const { inputFileEl, openUploadFiles, handleUploadFiles } = useCloudUploadFiles(currentParent, getData)


        // 上傳資料夾
        const { inputFolderEl, uploadList, createFolder, openUploadFolders, handleUploadFolder } = useCloudUploadFolders(currentParent, getData)


        // 路徑條滾動
        const scrollToRight = async () => {

            await nextTick()

            const el = historyWrapper.value

            if(!el) return

            el.scrollTo({ left:el.scrollWidth, behavior:'smooth' })

        }


        watch(historyList,()=>{
            scrollToRight()
        },
        { deep:true, immediate:true })


        onMounted(async()=>{

            scrollToRight()

            await getData()

        })


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
            handleUploadFolder
        }

    }
}
</script>

<style scoped>
    .cloud-navigatior-wrapper{
        width: 100%;
        overflow: hidden;
        position: relative;
        padding-left: 5px;
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
        right: 20px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 5px rgba(0,0,0,0.2);
        background: white;
        transition: box-shadow 0.3s ease;
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
</style>