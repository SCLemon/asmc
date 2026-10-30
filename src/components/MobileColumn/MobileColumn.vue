<template>
    <div class="mobile-column-options-wrapper-mobile-top">
        <div class="mobile-column-options-wrapper-mobile-top-logo" @click="goTo('/')">
            <img src="/logo/logo_banner_black.png" alt="">
        </div>
        <div class="mobile-column-options-wrapper-mobile-top-router">
            <div :class="['mobile-column-options-wrapper-mobile-top-user-block',{ 'mobile-column-options-wrapper-mobile-top-user-block-selected': $route.path.includes('mobile-gateway') }]" @click="goTo('/mobile-gateway')"><VIcon :icon="UserIcon" :size="24"></VIcon></div>
            <div v-if="$route.path.includes('/introduction')" :class="['mobile-column-options-wrapper-mobile-top-more',{ 'mobile-column-options-wrapper-mobile-top-more-is-open': openMobileList }]" @click="openMobileList = !openMobileList"><VIcon :icon="MenuIcon" :size="24"></VIcon></div>
            <div v-else class="mobile-column-options-wrapper-mobile-top-more" @click="logout()"><VIcon :icon="CloseIcon" :size="24"></VIcon></div>
        </div>
        <div class="mobile-column-options-wrapper-mobile" v-if="openMobileList">
            <div class="mobile-column-option" @click="goTo('/introduction/home')">
                Introduction
                <div class="mobile-column-option-selected-bar" :class="{'mobile-column-option-selected-bar-selected': $route.path.includes('/home')}"></div>
            </div>
            <div class="mobile-column-option"  @click="goTo('/introduction/members')">
                Members
                <div class="mobile-column-option-selected-bar" :class="{'mobile-column-option-selected-bar-selected': $route.path.includes('/members')}"></div>
            </div>
            <div class="mobile-column-option"  @click="goTo('/introduction/publications')">
                Publications
                <div class="mobile-column-option-selected-bar" :class="{'mobile-column-option-selected-bar-selected': $route.path.includes('/publications')}"></div>
            </div>
            <div class="mobile-column-option"  @click="goTo('/introduction/equipments')">
                Equipments
                <div class="mobile-column-option-selected-bar" :class="{'mobile-column-option-selected-bar-selected': $route.path.includes('/equipments')}"></div>
            </div>
            <div class="mobile-column-option"  @click="goTo('/introduction/contact')">
                Contact
                <div class="mobile-column-option-selected-bar" :class="{'mobile-column-option-selected-bar-selected': $route.path.includes('/contact')}"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { VIcon } from 'vorium-ui'
import { MenuIcon, UserIcon, CloseIcon } from 'vorium-ui/icons'
import 'vorium-ui/icons/icons.css'
import 'vorium-ui/dist/vorium-ui.css'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import jsCookie from 'js-cookie'

export default {
    name: 'MobileColumn',
    components: {
        VIcon
    },
    setup(){
        
        const openMobileList = ref(false)

        const router = useRouter();
        function goTo(path) {
            const isMobile = window.innerWidth <= 440;

            if (path == '/introduction/home' || isMobile) {
                document.querySelector('.view').scrollTo({ top: 0, behavior: 'smooth' })
            }
            router.replace(path).catch((e)=>{})
            openMobileList.value = false;
        }
        function logout(){
            jsCookie.remove('authToken');
            router.replace('/').catch((e)=>{})
        }
        return {
            goTo, MenuIcon, openMobileList, UserIcon, CloseIcon, logout
        }
    }
}
</script>

<style scoped>
    .mobile-column-option{
        width: fit-content;
        box-sizing: border-box;
        padding: 15px 10px 15px 10px;
        position: relative;
        user-select: none;
    }
    .mobile-column-option:hover{
        cursor: pointer;
    }
    .mobile-column-option-selected-bar{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2.5px;
        background: black;
        transition: width 0.25s ease;
    }
    .mobile-column-option-selected-bar-selected{
        width: 100%;
    }
    .mobile-column-option:hover .mobile-column-option-selected-bar{
        width: 100%;
    }
    /* mobile */
    .mobile-column-options-wrapper-mobile-top{
        display: none;
        z-index: 2;
        width: 100%;
        height: 60px;
        position: relative;
        background: black;
        box-sizing: border-box;
    }
    .mobile-column-options-wrapper-mobile-top-logo{
        width: 160px;
        margin-left: 12.5px;
    }
    .mobile-column-options-wrapper-mobile-top-logo>img{
        width: 100%;
    }
    .mobile-column-options-wrapper-mobile-top-router{
        margin-left: auto;
        display: flex;
        align-items: center;
    }
    .mobile-column-options-wrapper-mobile-top-user-block{
        color: white;
        width: 60px;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .mobile-column-options-wrapper-mobile-top-user-block:hover{
        cursor: pointer;
    }
    .mobile-column-options-wrapper-mobile-top-user-block-selected{
        background: rgba(255,255,255,0.1);
    }
    .mobile-column-options-wrapper-mobile-top-more{
        color: white;
        width: 60px;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .mobile-column-options-wrapper-mobile-top-more-is-open{
        background: rgba(255,255,255,0.1);
    }
    .mobile-column-options-wrapper-mobile{
        position: absolute;   
        width: 100%;
        top:100%;
        box-sizing: border-box;
        background: rgba(0,0,0,0.7);
    }
    @media screen and (max-width: 500px) {
        .introduction-wrapper{
            padding-top: 60px;
        }
        .mobile-column-options-wrapper {
            display: none;
        }
        .mobile-column-options-wrapper-mobile-top{
            display: flex;
            align-items: center;
        }
        .mobile-column-option{
            width: 100%;
            text-align: center;
            color: white;
        }
        .mobile-column-option-selected-bar{
            background: white;
            height: 2px;
        }
    }
</style>