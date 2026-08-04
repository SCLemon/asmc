<template>
    <div>
        <div class="analysis-tools-header-wrapper">
            <div class="analysis-tools-header-title">
                <VScanLight :scan="'text-shimmer'">Analysis Tools</VScanLight>
            </div>
            <div class="analysis-tools-header-input-wrapper"><VInput size="md" v-model="keyword" :suggestionList="suggestionList" :suggestionListIsLoading="isLoading"></VInput></div>
        </div>
        <div class="analysis-tools-list-wrapper">
            <div class="analysis-tools-list-item-wrapper" v-for="(tool, id) in filteredAnalysisTool" :key="id" @click="goTo(tool.path)">
                <div class="analysis-tools-list-item-icon">
                    <VIcon :icon="tool.icon" :size="36"></VIcon>
                </div>
                <div class="analysis-tools-list-item-title">{{ tool.title }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, watch, computed } from 'vue';
import { VInput, VScanLight, VIcon } from 'vorium-ui'
import 'vorium-ui/dist/vorium-ui.css'
import { useRouter } from 'vue-router'
import  analysisTool from '../../config/AnalysisTools/tools.js'
export default {
    name: 'AnalysisTools',
    components: {
        VInput, VScanLight, VIcon
    },
    setup(){

        
        const keyword = ref('');

        let list = analysisTool.map((tool)=> tool.title)
        
        let suggestionList = reactive([]);
        
        let timer = null;
        let isLoading = ref(false);
        let requestId = 0;

        watch(()=> keyword.value, (value)=>{

        clearTimeout(timer);

        timer = setTimeout(async ()=>{

            const currentId = ++requestId;

            isLoading.value = true;

            const filterList = list.filter(i => i.toLowerCase().includes(value.toLowerCase()))

            if(currentId != requestId) return;

            suggestionList.splice(0,suggestionList.length, ...filterList);

            isLoading.value = false;

        }, 300)

        }, { immediate: true })

        const filteredAnalysisTool = computed(() => {
            return analysisTool.filter((tool)=> {
                return ((tool.title).toLowerCase()).includes((keyword.value).toLowerCase())
            })
        })

        const router = useRouter();

        function goTo(path) {
            router.replace(path).catch((e)=>{})
        }

        return {
            goTo, keyword, analysisTool, isLoading, suggestionList, filteredAnalysisTool
        }
    }
}
</script>

<style scoped>
    .analysis-tools-header-wrapper{
        width: 100%;
        height: 80px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        padding-left: 30px;
        padding-right: 30px;
        background: black;
        color: white;
    }
    .analysis-tools-header-title{
        font-size: 24px;
        
    }
    .analysis-tools-header-input-wrapper{
        min-width: 300px;
        width: 30%;
        margin-left: auto;
    }
    .analysis-tools-list-wrapper{
        width: 100%;
        height: calc(100% - 80px);
        box-sizing: border-box;
        display: grid;
        grid-template-columns: repeat(auto-fit, 100px);
        gap: 25px;
        padding: 35px 30px 15px 30px;
    }
    .analysis-tools-list-item-wrapper{
        width: 100px;
        height: 100px;
        box-shadow: 0.5px 0.5px 5px gray;
        border-radius: 3px;
        transition: box-shadow 0.5s ease;
        padding-top: 10px;
        padding-bottom: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 15px;
        box-sizing: border-box;
    }
    .analysis-tools-list-item-wrapper:hover{
        cursor: pointer;
        box-shadow: 2px 2px 5px gray;
    }
    .analysis-tools-list-item-icon{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .analysis-tools-list-item-title{
        text-align: center;
        font-size: 14px;
    }
</style>