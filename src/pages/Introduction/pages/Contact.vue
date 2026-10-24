<template>
    <div class="labIntro-wrapper">
        <div class="title">Contact Us</div>
        <div class="content-wrapper">
            <div class="content-item-wrapper">
                <div class="content-item">
                    <div class="content-item-title">Address</div>
                    <div class="content-item-text">R209, Engineering Building III, National Tsing Hua University, No. 101, Sec. 2, Kuang-Fu Rd., East Dist., Hsinchu City 300044, Taiwan</div>
                </div>
                <div class="content-item">
                    <div class="content-item-title">Phone</div>
                    <div class="content-item-text">03-5715131 #34045</div>
                </div>
                <div class="content-item">
                    <div class="content-item-title">Email</div>
                    <div class="content-item-text">chyeh@ee.nthu.edu.tw（葉昭輝教授）</div>
                    <div class="content-item-text">blc0000421@gmail.com（林英豪）</div>
                </div>
                <div class="content-item">
                    <div class="content-item-title">Version</div>
                    <div class="content-item-text">v0.2.2.0 @2026.10.24</div>
                    <div class="content-item-subText">© 2026 SCLemon. All rights reserved.</div>
                </div>
            </div>
            <div class="content-map-wrapper">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d920.2709027444969!2d120.99143919368304!3d24.795999886346284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3468360b43489b8f%3A0xb57f0a1889160e20!2zMzAw5paw56u55biC5p2x5Y2A5YWJ5piO6YeM5bel56iL5LiJ6aSo!5e0!3m2!1szh-TW!2stw!4v1791704476138!5m2!1szh-TW!2stw" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
            </div>
        </div>
    </div>
</template>

<script>
import { VCarousel, VCarouselItem } from 'vorium-ui'
export default {
    components: { 
        VCarousel, VCarouselItem,
    },
    name: 'Contact',
    setup(){
        return {
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
    .content-wrapper{
        margin-top: 30px;
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    .content-item-wrapper{
        width: 49%;
        flex-shrink: 0;
    }
    .content-item{
        margin-bottom: 10px;
    }
    .content-item-title{
        font-size: 18px;
        font-weight: bolder;
        line-height: 1.65;
    }
    .content-item-text{
        font-size: 16px;
        margin-top: 5px;
        line-height: 1.5;
    }
    .content-item-subText{
        font-size: 12px;
        margin-top: 10px;
        color: rgba(210,210,210);
    }
    .content-map-wrapper{
        width: 49%;
        height: auto;
        flex-shrink: 0;
        box-sizing: border-box;
    }
    @media screen and (max-width: 450px) {
        .content-wrapper{
            margin-top: 5px;
            display: block;
        }
        .content-item-wrapper{
            width: 100%;
        }
        .content-map-wrapper{
            margin-top: 35px;
            width: 100%;
        }
        .content-item-title{
            font-size: 16px;
        }
        .content-item-text{
            font-size: 14px;
        }
    }
</style>