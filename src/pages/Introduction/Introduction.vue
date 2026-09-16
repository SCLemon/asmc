<template>
    <div class="introduction-wrapper">
        <div class="introduction-banner">
            <VCarousel :aspectRatio="2.4/1" :autoPlay="true" :interval="5000">
                <v-carousel-item><div class="introduction-banner-item"><img src="img/labIntro/banner_1.jpg" alt=""></div></v-carousel-item>
                <v-carousel-item><div class="introduction-banner-item"><img src="img/labIntro/banner_2.jpg" alt=""></div></v-carousel-item>
                <v-carousel-item><div class="introduction-banner-item"><img src="img/labIntro/banner_3.jpg" alt=""></div></v-carousel-item>
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
import { VCarousel, VCarouselItem } from 'vorium-ui'
import 'vorium-ui/dist/vorium-ui.css'
import { useRouter } from 'vue-router'
export default {
    name: 'Introduction',
    components: {
        VCarousel, VCarouselItem,
    },
    setup(){
        
        const router = useRouter();
        function goTo(path) {
            router.replace(path).catch((e)=>{})
        }
        return {
            goTo
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
        top: 12.5px;
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
</style>