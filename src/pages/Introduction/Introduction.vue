<template>
    <div class="introduction-wrapper">
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
import { MenuIcon, UserIcon } from 'vorium-ui/icons'
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
            goTo, MenuIcon, openMobileList, UserIcon
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
        user-select: none;
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

    @media screen and (max-width: 500px) {
        .introduction-view-options-wrapper {
            display: none;
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