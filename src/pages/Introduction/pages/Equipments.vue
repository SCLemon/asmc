<template>
    <div class="labIntro-wrapper">
        <div class="title">Equipments</div>
        <div class="content">Our laboratory is equipped with a wide range of advanced semiconductor fabrication and characterization instruments, covering thin-film deposition, lithography, device fabrication, material characterization, and electrical measurements.</div>
        <div class="content">These facilities provide an integrated research environment for the development and validation of advanced semiconductor devices. By leveraging state-of-the-art equipment and a comprehensive experimental platform, researchers can systematically investigate the entire process from materials and fabrication to device characterization and electrical analysis, effectively shortening experimental cycles, improving research efficiency, and accelerating the development and validation of emerging semiconductor devices and next-generation electronic technologies.</div>
        <div class="list-wrapper">
            <div class="list-item" v-for="(equipment, id) in equipments" :key="id">
                <div class="list-item-text-block">
                    <div class="list-item-text-block-title">{{ equipment.name }}</div>
                    <div class="list-item-text-block-description">{{ equipment.description }}</div>
                </div>
                <div class="list-item-img-block">
                    <VCarousel :aspectRatio="2/1">
                        <v-carousel-item v-for="(img, id) in equipment.img" :key="id"><div class="list-item-img-block-item"><img src="" v-lazy :data-src="img" alt=""></div></v-carousel-item>
                    </VCarousel>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { VCarousel, VCarouselItem } from 'vorium-ui'
import equipments from '../../../config/Intorduction/Lab/equipment';
export default {
    components: { 
        VCarousel, VCarouselItem,
    },
    name: 'Equipments',
    setup(){
        return {
            equipments
        }
    },
}
</script>

<style scoped>
    .labIntro-wrapper{
        padding: 30px 30px 30px 30px;
        box-sizing: border-box;
    }
    .title{
        font-size: 24px;
        font-weight: bolder;
        margin-bottom: 25px;
    }
    .content{
        margin-top: 15px;
        line-height: 1.65;
        text-align: justify;
    }
    .list-wrapper{
        height: auto;
    }
    .list-item{
        width: 100%;
        margin-top: 25px;
    }
    .list-item-text-block{
        width: 100%;
    }
    .list-item-text-block-title{
        font-size: 20px;
        font-weight: bolder;
        margin-bottom: 20px;
    }
    .list-item-text-block-description{
        line-height: 1.5;
        text-align: justify;
    }
    .list-item-img-block{
        margin-top: 25px;
        width: 100%;
    }
    .list-item-img-block-item{
        color: white;
        height: 100%;
    }
    .list-item-img-block img{
        width: 100%;
    }
    @media screen and (max-width: 852px) {
        .list-item-text-block-title{
            font-size: 18px;
            line-height: 1.5;
        }
        .content{
            font-size: 14px;
        }
        .list-item-text-block-description{
            font-size: 14px;
        }
    }
</style>