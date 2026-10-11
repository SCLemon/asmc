<template>
    <div class="labIntro-wrapper">
        <div class="title">Publications</div>
        <paper-list class="paper-list" :parameters="paper"></paper-list>
        <paper-list-mobile class="paper-list-mobile" :parameters="paper"></paper-list-mobile>
    </div>
</template>

<script>
import PaperList from './components/PaperList.vue';
import PaperListMobile from './components/PaperListMobile.vue';
import paper from '../../../config/Intorduction/Lab/paper';
export default {
    components: { 
        PaperList, PaperListMobile
    },
    name: 'Publications',
    setup(){
        return {
            paper
        }
    },
}
</script>

<style scoped>
    .labIntro-wrapper{
        padding: 30px 30px 0 30px;
        box-sizing: border-box;
    }
    .title{
        font-size: 24px;
        font-weight: bolder;
        margin-bottom: 25px;
    }
    .list-wrapper{
        margin-top: 15px;
        border: 1px solid red;
        height: auto;
    }
    .list-item{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }
    .paper-list-mobile{
        display: none;
    }
    @media screen and (max-width: 500px) {
        .paper-list{
            display: none;
        }
        .paper-list-mobile{
            display: block;
        }
    }
</style>