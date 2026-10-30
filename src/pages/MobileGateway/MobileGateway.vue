<template>
    <div class="mobile-gateway-wrapper">
        <div class="mobile-gateway-item" v-for="(item, id) in pathConfig.menu" :key="id" @click="goTo(item.path)">
            <div class="mobile-gateway-item-text-block">
                <VIcon :icon="item.icon" :size="180"></VIcon>
                <div class="mobile-gateway-item-title">{{ item.name }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { VIcon } from 'vorium-ui'
import { MenuIcon, UserIcon } from 'vorium-ui/icons'
import 'vorium-ui/icons/icons.css'
import 'vorium-ui/dist/vorium-ui.css'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import pathConfig from '../../config/MobileColumn/pathConfig'
export default {
    name: 'MobileGateWay',
    components: {
        VIcon
    },
    setup(){
        const router = useRouter();
        function goTo(path) {
            router.replace(path).catch((e)=>{})
        }
        return {
            UserIcon, pathConfig, goTo
        }
    }
}
</script>

<style scoped>
    .mobile-gateway-wrapper{
        width: 100%;
        height: calc(100vh - 60px);
        box-sizing: border-box;
        overflow-y: scroll;
        display: flex;
        align-items: center;
        flex-direction: column;
        gap:30px;
        padding-top: 30px;
    }
    .mobile-gateway-item{
        width: 90%;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0.5px 0.5px 5px gray;
        border-radius: 3px;
        transition: box-shadow 0.5s ease;
    }
    .mobile-gateway-item:hover{
        cursor: pointer;
        box-shadow: 4px 4px 5px gray;
    }
    .mobile-gateway-item-title{
        margin-top: 30px;
        text-align: center;
        font-size: 24px;
        font-weight: bolder;
    }
</style>