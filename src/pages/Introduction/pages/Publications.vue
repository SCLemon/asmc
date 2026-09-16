<template>
    <div class="labInto-wrapper">
        <div class="title">Publications</div>
        <paper-list :parameters="paper"></paper-list>
    </div>
</template>

<script>
import PaperList from './components/PaperList.vue';
import paper from '../../../config/Intorduction/Lab/paper';
export default {
    components: { 
        PaperList
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
    .labInto-wrapper{
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
</style>