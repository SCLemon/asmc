<template>
    <div class="introduction-wrapper">
        <div class="introduction-banner">
            <VCarousel :aspectRatio="3/1" :autoPlay="true" :interval="5000">
                <v-carousel-item><div class="introduction-banner-item">Build. Measure. Iterate.</div></v-carousel-item>
                <v-carousel-item><div class="introduction-banner-item">Build. Measure. Iterate.</div></v-carousel-item>
                <v-carousel-item><div class="introduction-banner-item">Build. Measure. Iterate.</div></v-carousel-item>
                <v-carousel-item><div class="introduction-banner-item">Build. Measure. Iterate.</div></v-carousel-item>
                <v-carousel-item><div class="introduction-banner-item">Build. Measure. Iterate.</div></v-carousel-item>
            </VCarousel>
        </div>
        <lab-intro></lab-intro>
        <lab-member></lab-member>
    </div>
</template>

<script>
import { VCarousel, VCarouselItem } from 'vorium-ui'
import 'vorium-ui/dist/vorium-ui.css'
import LabIntro from './components/LabIntro.vue'
import LabMember from './components/LabMember.vue';
export default {
    name: 'Introduction',
    components: {
        VCarousel, VCarouselItem,
        LabIntro, LabMember
    },
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
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>