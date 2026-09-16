<template>
    <div class="labInto-wrapper">
        <div class="title">ASMC LAB</div>
        <div class="content">Founded by <span style="font-weight: bolder;">Dr. Chao-Hui Yeh (葉昭輝教授)</span> of the Institute of Electronics Engineering at National Tsing Hua University (NTHU), our laboratory is located in Room R209, Engineering Building III, National Tsing Hua University, Hsinchu, Taiwan.</div>
        <div class="content">Our research focuses on emerging semiconductor technologies, including <span style="font-weight: bolder;">two-dimensional (2D) materials and devices</span>, next-generation non-volatile memory technologies such as <span style="font-weight: bolder;">Resistive RAM (ReRAM)</span> and <span style="font-weight: bolder;">Ferroelectric RAM (FeRAM)</span>, and <span style="font-weight: bolder;">3D integrated circuit (3D IC) heterogeneous integration</span>. We are dedicated to developing advanced electronic devices and <span style="font-weight: bolder;">intelligent computing technologies</span> while addressing key challenges in next-generation semiconductor innovation.</div>
        <div class="img-wrapper">
            <img class="img" src="img/labIntro/img_1.png" alt="">
            <img class="img" src="img/labIntro/img_2.png" alt="">
            <img class="img" src="img/labIntro/img_3.jpg" alt="">
        </div>
        <div class="content">Through interdisciplinary research in advanced semiconductor devices, emerging memory, 2D materials, and 3D IC integration, our laboratory aims to advance high-performance, energy-efficient, and scalable technologies for the future of electronics and intelligent computing.</div>
    </div>
</template>

<script>
export default {
    name: 'Home',
    setup(){
        return {
        }
    },
}
</script>

<style scoped>
    .labInto-wrapper{
        padding: 30px 30px 20px 30px;
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
    .img-wrapper{
        margin-top: 20px;
        width: 100%;

        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
    }

    .img{
        width: 100%;
    }
</style>