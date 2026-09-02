<template>
    <div>
        <div class="cloud-navigatior-wrapper" ref="historyWrapper">
            <div class="cloud-navigatior-history-list">
                <div v-for="(item, id) in historyList" :key="id" class="cloud-navigatior-history-item-wrapper">
                    <VIcon :icon="ChevronRightIcon" :size="16" v-if="id" :style="{color: (id == (historyList.length - 1)) ? 'black':'rgba(0,0,0,0.2)'}"></VIcon>
                    <div class="cloud-navigatior-history-item" :class="{ 'cloud-navigatior-history-item-selected': id == (historyList.length - 1)}">{{ item }}</div>

                </div>
            </div>
        </div>
        <dashboard :parent="''"></dashboard>
    </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import Dashboard from './components/Dashboard.vue';
import { computed, ref, nextTick, watch, onMounted } from 'vue';

import { VIcon } from 'vorium-ui'
import { ChevronRightIcon } from 'vorium-ui/icons'
import 'vorium-ui/icons/icons.css'

export default {
    name: 'Cloud',
    components:{
        Dashboard, VIcon
    },
    setup(){
        const router = useRouter();
        const route = useRoute();
        
        const historyWrapper = ref(null)

        const historyList = ref([
            '我的雲端硬碟', '我的雲端硬碟', '我的雲端硬碟','我的雲端硬碟', '我的雲端硬碟', '我的雲端硬碟','我的雲端硬碟', '我的雲端硬碟', '我的雲端硬碟','我的雲端硬碟', '我的雲端硬碟', '我的雲端硬碟','我的雲端硬碟', '我的雲端硬碟', '我的雲端硬碟','我的雲端硬碟', '我的雲端硬碟', '我的雲端硬碟','我的雲端硬碟', '我的雲端硬碟', '我的雲端硬碟','我的雲端硬碟', '我的雲端硬碟', '我的雲端硬碟','我的雲端硬碟', '我的雲端硬碟', '我的雲端硬碟','我的雲端硬碟', '我的雲端硬碟', '我的雲端硬碟','我的雲端硬碟', '我的雲端硬碟', '我的雲端硬碟','我的雲端硬碟', '我的雲端硬碟', '我的雲端硬碟',
        ]);

        const parent = computed(()=>{
            return route.path.replace('/cloud','');
        })


        onMounted(() => {
            scrollToRight()
        })



        const scrollToRight = async () => {
            await nextTick()

            const el = historyWrapper.value

            if (!el) return

            el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' })
        }

        watch(historyList, () => {
            scrollToRight()
        },
        { deep: true, immediate: true })

        return {
            parent, historyWrapper, historyList, ChevronRightIcon
        }
    }
}
</script>

<style scoped>
    .cloud-navigatior-wrapper{
        width: 100%;
        overflow: hidden;
        position: relative;
        padding-left: 5px;
        padding-right: 550px;
        box-sizing: border-box;
        height: 80px;
        box-shadow: 0px 3px 3px rgba(0,0,0,0.12);
        display: flex;
        align-items: center;
    }

    .cloud-navigatior-history-list {
        display: flex;
        align-items: center;
        white-space: nowrap;
        flex-wrap: nowrap;
    }
    .cloud-navigatior-history-item{
        padding-left: 15px;
        padding-right: 15px;
        color: rgba(0,0,0,0.2);
        flex-shrink: 0;
    }
    .cloud-navigatior-history-item-wrapper{
        display: flex;
        align-items: center;
    }
    .cloud-navigatior-history-item-selected{
        color: black;
        font-weight: bolder;
    }
</style>