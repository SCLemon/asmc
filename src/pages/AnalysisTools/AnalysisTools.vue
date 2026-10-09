<template>
    <div>
        <div class="analysis-tools-header-wrapper">
            <div class="analysis-tools-header-title">
                <VScanLight :scan="'text-shimmer'">Analysis Tools</VScanLight>
            </div>
            <div class="analysis-tools-header-input-wrapper">
                <VInput size="md" v-model="keyword" :suggestionList="suggestionList" :suggestionListIsLoading="isLoading"></VInput>
            </div>
        </div>
        <div class="analysis-tools-list-wrapper">
            <div class="analysis-tools-list-item-wrapper" v-for="(tool, index) in filteredAnalysisTool" :key="tool.id || index">
                <div class="analysis-tools-list-item-wrapper-detail">
                    <div class="analysis-tools-list-item-icon"><img :src="tool.imgUrl" alt=""></div>
                    <div class="analysis-tools-list-item-text-wrapper">
                        <div class="analysis-tools-list-item-text-title">{{ tool.title }}</div>
                        <div class="analysis-tools-list-item-text-subTitle">{{ tool.subTitle }}</div>
                        <div class="analysis-tools-list-item-text-description">{{ tool.description }}</div>
                    </div>
                </div>
                <div class="analysis-tools-list-item-wrapper-button-wrapper">
                    <!-- 綁定該項目的獨立狀態 -->
                    <el-button 
                        :type="getBtnState(tool.cloudId || index).status === 'error' ? 'danger' : 'primary'"
                        class="analysis-tools-list-item-wrapper-button"
                        :loading="getBtnState(tool.cloudId || index).status === 'loading'"
                        :disabled="getBtnState(tool.cloudId || index).status === 'loading'"
                        @click="download(tool.cloudId)"
                    >
                        <!-- Loading 狀態：顯示百分比 (若後端無 total 則顯示已下載 MB) -->
                        <template v-if="getBtnState(tool.cloudId || index).status === 'loading'">
                            {{ getBtnState(tool.cloudId || index).progressText }}
                        </template>
                        <!-- 失敗狀態：顯示 ERROR -->
                        <template v-else-if="getBtnState(tool.cloudId || index).status === 'error'">
                            ERROR
                        </template>
                        <!-- 預設狀態 -->
                        <template v-else>
                            Download
                        </template>
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, watch, computed } from 'vue';
import { VInput, VScanLight, VIcon } from 'vorium-ui';
import 'vorium-ui/dist/vorium-ui.css';
import { ElMessageBox, ElNotification } from 'element-plus';
import analysisTool from '../../config/AnalysisTools/tools.js';

import jsCookie from 'js-cookie'
import axios from 'axios'

export default {
    name: 'AnalysisTools',
    components: {
        VInput, VScanLight, VIcon
    },
    setup(){
        const keyword = ref('');
        let list = analysisTool.map((tool) => tool.title);
        let suggestionList = reactive([]);
        let timer = null;
        let isLoading = ref(false);
        let requestId = 0;

        // 用於儲存各按鈕下載狀態的物件 (以 key 隔離)
        const downloadStates = reactive({});

        const getBtnState = (key) => {
            if (!downloadStates[key]) {
                downloadStates[key] = {
                    status: 'idle', // 'idle' | 'loading' | 'error'
                    progressText: '0%',
                    timer: null
                };
            }
            return downloadStates[key];
        };

        watch(() => keyword.value, (value) => {
            clearTimeout(timer);
            timer = setTimeout(async () => {
                const currentId = ++requestId;
                isLoading.value = true;
                const filterList = list.filter(i => i.toLowerCase().includes(value.toLowerCase()));

                if (currentId !== requestId) return;
                suggestionList.splice(0, suggestionList.length, ...filterList);
                isLoading.value = false;
            }, 300);
        }, { immediate: true });

        const filteredAnalysisTool = computed(() => {
            return analysisTool.filter((tool) => {
                return (tool.title.toLowerCase()).includes(keyword.value.toLowerCase());
            });
        });
        
        async function download(toolKey, token) {
            const state = getBtnState(toolKey);

            // 避免重複點擊
            if (state.status === 'loading') return;

            // 清除之前的重置計時器（若有）
            if (state.timer) {
                clearTimeout(state.timer);
                state.timer = null;
            }

            // 初始化狀態
            state.status = 'loading';
            state.progressText = '0%';

            try {
                const res = await axios.get(`/api/cloud/user/download/${token}`, {
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    },
                    responseType: 'blob',
                    onDownloadProgress: (event) => {
                        if (event.total) {
                            const percent = Math.round((event.loaded / event.total) * 100);
                            state.progressText = `${percent}%`;
                        } 
                        else {
                            const loadedMB = (event.loaded / (1024 * 1024)).toFixed(1);
                            state.progressText = `${loadedMB}MB`;
                        }
                    }
                });

                const contentDisposition = res.headers['content-disposition'];
                let fileName = 'download';

                if (contentDisposition) {
                    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/);
                    const normalMatch = contentDisposition.match(/filename="?([^"]+)"?/);

                    if (utf8Match?.[1]) {
                        fileName = decodeURIComponent(utf8Match[1]);
                    } else if (normalMatch?.[1]) {
                        fileName = normalMatch[1];
                    }
                }

                const blob = new Blob([res.data], {
                    type: res.headers['content-type']
                });

                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = fileName;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                link.remove();
                URL.revokeObjectURL(blobUrl);

                // 下載成功重置
                state.status = 'idle';
                state.progressText = '0%';
            } catch (e) {
                console.error(e);

                // 下載失敗標記為 error
                state.status = 'error';

                // 5 秒後自動回歸 Download
                state.timer = setTimeout(() => {
                    state.status = 'idle';
                    state.timer = null;
                }, 5000);
            }
        }

        return {
            keyword,
            analysisTool,
            isLoading,
            suggestionList,
            filteredAnalysisTool,
            download,
            getBtnState
        };
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
        grid-template-columns: repeat(auto-fit, 350px);
        gap: 25px;
        padding: 35px 30px 15px 30px;
    }
    .analysis-tools-list-item-wrapper{
        width: 350px;
        height: 200px;
        box-shadow: 0.5px 0.5px 5px gray;
        border-radius: 3px;
        transition: box-shadow 0.5s ease;
        box-sizing: border-box;
        padding-top: 5px;
    }
    .analysis-tools-list-item-wrapper:hover{
        cursor: pointer;
        box-shadow: 2px 2px 5px gray;
    }
    .analysis-tools-list-item-wrapper-detail{
        width: 100%;
        height: 135px;
        display: flex;
        align-items: center;
        padding-right: 7.5px;
        box-sizing: border-box;
    }
    .analysis-tools-list-item-icon{
        width: 80px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        padding-left: 10px;
        padding-right: 15px;
    }
    .analysis-tools-list-item-icon>img{
        width: 100%;
    }
    .analysis-tools-list-item-text-wrapper{
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .analysis-tools-list-item-text-title {
        font-size: 20px;
        font-weight: bolder;
        width: 100%;
        height: 47.5px;
        line-height: 47.5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .analysis-tools-list-item-text-subTitle{
        font-size: 12px;
        color: rgba(210,210,210);
    }
    .analysis-tools-list-item-text-description {
        margin-top: 11px;
        line-height: 1.35;
        width: 100%;
        font-size: 11px;
        color: rgba(210, 210, 210);
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        line-clamp: 4;
    }
    .analysis-tools-list-item-wrapper-button-wrapper{
        width: 100%;
        height: 55px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
    }
    .analysis-tools-list-item-wrapper-button{
        width: 95%;
    }
</style>