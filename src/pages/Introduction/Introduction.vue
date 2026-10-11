<template>
    <div class="introduction-wrapper">
        <div class="introduction-view-options-wrapper-mobile-top">
            <div class="introduction-view-options-wrapper-mobile-top-logo">
                <img src="/logo/logo_banner_black.png" alt="">
            </div>
            <div :class="['introduction-view-options-wrapper-mobile-top-more',
                { 'introduction-view-options-wrapper-mobile-top-more-is-open': openMobileList }
            ]" @click="openMobileList = !openMobileList">
                <VIcon :icon="MenuIcon" :size="24"></VIcon>
            </div>
            <div class="introduction-view-options-wrapper-mobile" v-if="openMobileList">
                <div class="introduction-view-option" @click="goTo('/introduction/home')">
                    Introduction
                    <div class="introduction-view-option-selected-bar" :class="{'introduction-view-option-selected-bar-selected': $route.path.includes('/home')}"></div>
                </div>
                <div class="introduction-view-option"  @click="goTo('/introduction/members')">
                    Members
                    <div class="introduction-view-option-selected-bar" :class="{'introduction-view-option-selected-bar-selected': $route.path.includes('/members')}"></div>
                </div>
                <div class="introduction-view-option"  @click="goTo('/introduction/publications')">
                    Publications
                    <div class="introduction-view-option-selected-bar" :class="{'introduction-view-option-selected-bar-selected': $route.path.includes('/publications')}"></div>
                </div>
                <div class="introduction-view-option"  @click="goTo('/introduction/equipments')">
                    Equipments
                    <div class="introduction-view-option-selected-bar" :class="{'introduction-view-option-selected-bar-selected': $route.path.includes('/equipments')}"></div>
                </div>
                <div class="introduction-view-option"  @click="goTo('/introduction/contact')">
                    Contact
                    <div class="introduction-view-option-selected-bar" :class="{'introduction-view-option-selected-bar-selected': $route.path.includes('/contact')}"></div>
                </div>
            </div>
        </div>
        <div class="introduction-banner">
            <VCarousel :aspectRatio="2.4/1" :autoPlay="true" :interval="5000">
                <v-carousel-item><div class="introduction-banner-item"><img src="/img/labIntro/banner_1.jpg" alt=""></div></v-carousel-item>
                <v-carousel-item><div class="introduction-banner-item"><img src="/img/labIntro/banner_2.jpg" alt=""></div></v-carousel-item>
                <v-carousel-item><div class="introduction-banner-item"><img src="/img/labIntro/banner_3.jpg" alt=""></div></v-carousel-item>
            </VCarousel>
        </div>
        <div class="introduction-view-wrapper">
            <div class="introduction-view-options-wrapper">
                <div class="introduction-view-option" @click="goTo('/introduction/home')">
                    Introduction
                    <div class="introduction-view-option-selected-bar" :class="{'introduction-view-option-selected-bar-selected': $route.path.includes('/home')}"></div>
                </div>
                <div class="introduction-view-option"  @click="goTo('/introduction/members')">
                    Members
                    <div class="introduction-view-option-selected-bar" :class="{'introduction-view-option-selected-bar-selected': $route.path.includes('/members')}"></div>
                </div>
                <div class="introduction-view-option"  @click="goTo('/introduction/publications')">
                    Publications
                    <div class="introduction-view-option-selected-bar" :class="{'introduction-view-option-selected-bar-selected': $route.path.includes('/publications')}"></div>
                </div>
                <div class="introduction-view-option"  @click="goTo('/introduction/equipments')">
                    Equipments
                    <div class="introduction-view-option-selected-bar" :class="{'introduction-view-option-selected-bar-selected': $route.path.includes('/equipments')}"></div>
                </div>
                <div class="introduction-view-option"  @click="goTo('/introduction/contact')">
                    Contact
                    <div class="introduction-view-option-selected-bar" :class="{'introduction-view-option-selected-bar-selected': $route.path.includes('/contact')}"></div>
                </div>
            </div>
            <router-view v-slot="{ Component }">
                <Transition name="page" mode="out-in">
                    <component :is="Component" />
                </Transition>
            </router-view>
        </div>
    </div>
</template>

<script>
import { VCarousel, VCarouselItem, VIcon } from 'vorium-ui'
import { MenuIcon } from 'vorium-ui/icons'
import 'vorium-ui/icons/icons.css'
import 'vorium-ui/dist/vorium-ui.css'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

export default {
    name: 'Introduction',
    components: {
        VCarousel, VCarouselItem, VIcon
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
        return {
            goTo, MenuIcon, openMobileList
        }
    }
}
</script>

<style scoped>
    .introduction-wrapper{
        box-sizing: border-box;
    }
    .introduction-banner{
        width: 100%;
        margin: 0 auto;
        z-index: 2;
    }
    .introduction-banner-item{
        color: white;
        height: 100%;
    }
    .introduction-banner-item>img{
        width: 100%;
    }
    .introduction-view-wrapper{
        position: relative;
        width: 100%;
    }
    .introduction-view-options-wrapper{
        position: absolute;
        top: 18px;
        right:30px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 5px;
    }
    .introduction-view-option{
        width: fit-content;
        box-sizing: border-box;
        padding: 15px 10px 15px 10px;
        position: relative;
    }
    .introduction-view-option:hover{
        cursor: pointer;
    }
    .introduction-view-option-selected-bar{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2.5px;
        background: black;
        transition: width 0.25s ease;
    }
    .introduction-view-option-selected-bar-selected{
        width: 100%;
    }
    .introduction-view-option:hover .introduction-view-option-selected-bar{
        width: 100%;
    }
    .introduction-view-options-wrapper-mobile-top{
        display: none;
        z-index: 9999;
        width: 100%;
        height: 60px;
        position: fixed;
        top: 0;
        background: black;
        box-sizing: border-box;
    }
    .introduction-view-options-wrapper-mobile-top-logo{
        width: 160px;
        margin-left: 12.5px;
    }
    .introduction-view-options-wrapper-mobile-top-logo>img{
        width: 100%;
    }
    .introduction-view-options-wrapper-mobile-top-more{
        margin-left: auto;
        color: white;
        width: 60px;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .introduction-view-options-wrapper-mobile-top-more-is-open{
        background: rgba(255,255,255,0.1);
    }
    .introduction-view-options-wrapper-mobile{
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
        .introduction-view-options-wrapper {
            display: none;
        }
        .introduction-view-options-wrapper-mobile-top{
            display: flex;
            align-items: center;
        }
        .introduction-view-option{
            width: 100%;
            text-align: center;
            color: white;
        }
        .introduction-view-option-selected-bar{
            background: white;
            height: 2px;
        }
    }
</style>