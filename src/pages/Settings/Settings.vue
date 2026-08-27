<template>
    <div>
        <div class="settings-header-wrapper">
            <div class="settings-header-title">
                <VScanLight :scan="'text-shimmer'">Workspace Settings</VScanLight>
            </div>
            <div class="settings-header-input-wrapper"><VInput size="md" v-model="keyword" :suggestionList="suggestionList" :suggestionListIsLoading="isLoading"></VInput></div>
        </div>

        <div class="settings-list-wrapper-all" v-for="(category, categoryId) in filteredSettings" :key="categoryId">
            <div class="settings-list-wrapper-title">{{ category.title }}</div>
            <div class="settings-list-wrapper">
                <div class="settings-list-item-wrapper" v-for="(tool, toolId) in category.block" :key="toolId" @click="goTo(tool.path)">
                    <div class="settings-list-item-icon">
                        <VIcon :icon="tool.icon" :size="36"></VIcon>
                    </div>
                    <div class="settings-list-item-title">{{ tool.title }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, watch, computed } from 'vue';
import { VInput, VScanLight, VIcon } from 'vorium-ui'
import 'vorium-ui/dist/vorium-ui.css'
import { useRouter } from 'vue-router'
import settings from '../../config/Settings/settings.js'
export default {
    name: 'settingss',
    components: {
        VInput, VScanLight, VIcon
    },
    setup(){

        const keyword = ref('');

        let list = settings.flatMap((i) => i.block.map((item) => item.title))
        
        let suggestionList = reactive([]);
        
        let timer = null;
        let isLoading = ref(false);
        let requestId = 0;

        watch(() => keyword.value, (value) => {

            clearTimeout(timer);

            timer = setTimeout(async () => {

                const currentId = ++requestId;

                isLoading.value = true;

                const filterList = list.filter(i => i.toLowerCase().includes(value.toLowerCase()))

                if(currentId != requestId) return;

                suggestionList.splice(0, suggestionList.length, ...filterList);

                isLoading.value = false;

            }, 300)

        }, { immediate: true })

        const filteredSettings = computed(() => {
            const searchValue = keyword.value.toLowerCase();

            return settings.map((category) => ({
                    ...category,
                    block: category.block.filter((tool) => {
                        return tool.title.toLowerCase().includes(searchValue);
                    })
                }))
                .filter((category) => category.block.length > 0)
        })

        const router = useRouter();

        function goTo(path) {
            router.replace(path).catch((e) => {})
        }

        return {
            goTo,
            keyword,
            settings,
            isLoading,
            suggestionList,
            filteredSettings
        }
    }
}
</script>

<style scoped>
    .settings-header-wrapper{
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
    .settings-header-title{
        font-size: 24px;
        
    }
    .settings-header-input-wrapper{
        min-width: 300px;
        width: 30%;
        margin-left: auto;
    }
    .settings-list-wrapper-all{
        padding: 35px 30px 0px 30px;
    }
    .settings-list-wrapper-title{
        font-weight: bolder;
        font-size: 18px;
    }
    .settings-list-wrapper{
        width: 100%;
        height: calc(100% - 80px);
        box-sizing: border-box;
        display: grid;
        grid-template-columns: repeat(auto-fit, 100px);
        gap: 25px;
        margin-top: 25px;
    }
    .settings-list-item-wrapper{
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
    .settings-list-item-wrapper:hover{
        cursor: pointer;
        box-shadow: 2px 2px 5px gray;
    }
    .settings-list-item-icon{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .settings-list-item-title{
        text-align: center;
        font-size: 14px;
    }
</style>