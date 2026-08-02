<template>
    <div>
        <lab-intro></lab-intro>
        <lab-member></lab-member>
    </div>
</template>

<script>
import LabIntro from './components/LabIntro.vue';
import LabMember from './components/LabMember.vue';
export default {
    name: 'Home',
    components:{
        LabIntro, LabMember
    }
}
</script>

<style>

</style>