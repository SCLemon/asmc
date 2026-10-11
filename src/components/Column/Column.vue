<template>
  <div class="column-wrapper">
    <div class="column-logo-wrapper">
        <img class="column-logo-img" src="/logo/logo.png" alt="">
    </div>
    <div class="column-menu-wrapper">
        <div class="common-item" 
            v-for="(item,k) in pathConfig.menu" :key="k"  
            :class="{'common-item-selected': $route.path.includes(item.path)}" 
            @click="goTo(item.path)">
            <VIcon :icon="item.icon" :size="24"></VIcon>
        </div>
    </div>
    <div class="column-setting-wrapper">
        <div class="common-item" 
            v-for="(item,k) in pathConfig.setting" :key="k"  
            :class="{'common-item-selected': $route.path.includes(item.path)}" 
            @click="goTo(item.path)">
            <VIcon :icon="item.icon" :size="24"></VIcon>
        </div>
    </div>
  </div>
</template>

<script>
import { VIcon } from 'vorium-ui'
import { useRouter } from 'vue-router'
import pathConfig from '../../config/Column/pathConfig'

import 'vorium-ui/icons/icons.css'
export default {
    name: 'Column',
    components:{
        VIcon
    },
    setup(){

        const router = useRouter();

        function goTo(path) {
            router.replace(path).catch((e)=>{})
        }

        return {
            goTo, pathConfig
        }
    }
}
</script>

<style scoped>
    .column-wrapper{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        background: black;
        position: relative;
    }
    /* common */
    .common-item{
        width: 100%;
        height: 65px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgba(255,255,255,0.7);
        box-sizing: border-box;
        transition: 
            background 0.25s ease,
            color 0.25s ease
        ;
    }
    .common-item:hover{
        cursor: pointer;
        background: rgba(255,255,255,0.12);
        color: white;
    }
    .common-item-selected{
        color: white;
        background: rgba(255,255,255,0.12);
    }

    /* column-logo */
    .column-logo-wrapper{
        width: 100%;
        aspect-ratio: 1/1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .column-logo-img{
        width: 35px;
        aspect-ratio: 1/1;
    }
    /* column-setting */
    .column-setting-wrapper{
        position: absolute;
        width: 100%;
        bottom: 0;
    }


</style>