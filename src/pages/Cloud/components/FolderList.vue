<template>
    <div class="folder-list-wrapper">

        <div class="folder-item" v-for="(folder, id) in folderList"  :key="id" @click="goTo(folder.token)">
            <div class="folder-item-icon"><VIcon :icon="FolderIcon" :size="16"></VIcon></div>
            <div class="folder-item-title">{{ folder.name }}</div>
            <div class="folder-item-more" @click.stop="openTargetFolderMoreList(folder.token)">
                <VIcon :icon="MoreVerticalIcon" :size="16"></VIcon>
                <MoreList v-if="activeMoreToken === folder.token" :token="folder.token" @close="activeMoreToken = null" :source="folder"></MoreList>
            </div>

        </div>

    </div>
</template>

<script>
import { ref } from 'vue';

import { VIcon } from 'vorium-ui'
import { FolderIcon, MoreVerticalIcon } from 'vorium-ui/icons'
import 'vorium-ui/icons/icons.css'

import { useRouter } from 'vue-router';

import MoreList from './components/MoreList.vue';


export default {
    name: 'FolderList',

    props:{

        folderList:{
            type: Array,
            default: () => []
        },

    },
    components:{
        VIcon, MoreList
    },

    setup(){

        const router = useRouter();

        const activeMoreToken = ref(null);

        function goTo(token){
            window.getSelection()?.removeAllRanges();
            router.replace(`/cloud/${token}`).catch(e=>{});
        }

        function openTargetFolderMoreList(token){

            if(activeMoreToken.value === token) activeMoreToken.value = null;
            else activeMoreToken.value = token;

        }


        return {
            FolderIcon,
            MoreVerticalIcon,
            activeMoreToken,
            goTo,
            openTargetFolderMoreList
        }

    }
}
</script>

<style scoped>
.folder-list-wrapper {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 15px;
    row-gap: 20px;
    width: 100%;
    min-width: 0;
    padding: 30px;
    box-sizing: border-box;
}

.folder-item {
    width: 100%;
    min-width: 0;
    height: 50px;
    border-radius: 10px;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 10px;
    box-sizing: border-box;
    padding: 0 10px;
    transition: box-shadow 0.25s ease;
}

.folder-item:hover {
    cursor: pointer;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);
}

.folder-item-icon {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
}

.folder-item-title {
    flex: 1;
    min-width: 0;
    height: 30px;
    line-height: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    user-select: none;
}

.folder-item-more {
    width: 30px;
    height: 30px;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex-shrink: 0;
}

.folder-item-more:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.05);
}

@media screen and (max-width: 1380px) {
    .folder-list-wrapper {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media screen and (max-width: 500px) {
    .folder-list-wrapper {
        grid-template-columns: repeat(1, minmax(0, 1fr));
        padding: 15px;
    }
}
</style>