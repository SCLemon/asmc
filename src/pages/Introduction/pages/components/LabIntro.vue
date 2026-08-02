<template>
    <div class="labInto-wrapper">
        <div class="title">ASMC LAB</div>
        <div class="content" v-for="(paragraph, id) in intro.paragraph" :key="id">{{ paragraph }}</div>
        <div class="img-wrapper">
            <img class="img"  v-for="(img, id) in intro.img" :key="id" :src="img" alt="">
        </div>
    </div>
</template>

<script>
import intro from '../../../../config/Intorduction/Lab/intro';
export default {
    name: 'LabIntro',
    setup(){
        return {
            intro
        }
    },
}
</script>

<style scoped>
    .labInto-wrapper{
        padding: 30px 30px 0 30px;
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