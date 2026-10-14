<template>
  <div class="edit-experiment-record-wrapper">
    <div class="edit-experiment-record-header">
        <div class="edit-experiment-record-title">
            <div>{{  title || 'Experiment Recipes' }}</div>
            <div class="edit-experiment-record-title-icon" @click="rename()"><VIcon :size="24" :icon="EditIcon"></VIcon></div>
        </div>
        <div class="edit-experiment-record-right">
            <div class="edit-experiment-record-button"><el-button @click="goBack()">返回列表</el-button></div>
            <div class="edit-experiment-record-button"><el-button @click="save()" type="primary">儲存資訊</el-button></div>
        </div>
    </div>
    <div class="edit-experiment-record-abstract" contenteditable="true" v-html="abstract" ref="abstractEl"></div>
    <div class="edit-experiment-record-table">
         <el-collapse v-model="activeNames" v-if="dataSet.length" accordion>
            <el-collapse-item v-for="(exp, id) in dataSet" :key="exp.token" :title="`Step ${id+1}. ${exp.title}`" :name="exp.token" class="exp-params-item-wrapper">
                <div class="exp-params-item-function-block">
                    <VIcon class="exp-params-item-function-icon" :icon="PlusIcon" @click="openAdd(id+1)"></VIcon>
                    <VIcon class="exp-params-item-function-icon" :icon="ChevronUpIcon" @click="move(exp.token, 'up')"></VIcon>
                    <VIcon class="exp-params-item-function-icon" :icon="ChevronDownIcon" @click="move(exp.token, 'down')"></VIcon>
                    <VIcon class="exp-params-item-function-icon" :icon="TrashIcon" style="color: red;" @click="removeItem(exp.token)"></VIcon>
                </div>
                <div class="exp-params-form-body">
                    <el-form label-position="top">
                        <el-row :gutter="16">
                            <el-col :span="12" v-for="param in exp.params" :key="param.params">
                                <el-form-item :label="param.name">
                                    <el-input-number v-if="param.type === 'number'" v-model="exp.formData[param.params]" :placeholder="`請輸入 ${param.name}`" style="width: 100%;" controls-position="right"/>
                                    <el-input v-else-if="param.type === 'textarea'" type="textarea" v-model="exp.formData[param.params]" :placeholder="`請輸入 ${param.name}`" :rows="3" :autosize="{ minRows: 3, maxRows: 6 }" clearable/>
                                    <el-input v-else v-model="exp.formData[param.params]" :placeholder="`請輸入 ${param.name}`" clearable/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-collapse-item>
        </el-collapse>
        <div v-else class="edit-experiment-record-initialize" @click="openAdd(0)">
            <VIcon :size="24" :icon="PlusIcon"></VIcon>
        </div>
    </div>
    <el-dialog v-model="dialogVisible" title="新增站點">
        <el-select v-model="selected_option" placeholder="Select" style="width: 100%;">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addItem()">新增</el-button>
            </div>
        </template>
    </el-dialog>
  </div>
</template>

<script>

import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { eventBus } from '@/utils/eventBus.js';
import jsCookie from 'js-cookie';

import { VIcon } from 'vorium-ui'
import { PlusIcon, ChevronUpIcon, ChevronDownIcon, TrashIcon, EditIcon } from 'vorium-ui/icons'
import 'vorium-ui/icons/icons.css'

import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router';

import expConfig from '@/config/ExperimentRecipes/expConfig.js';

import { v4 as uuidv4 } from 'uuid'

export default {
    name: 'EditExperimentRecord',
    components:{
        VIcon
    },
    setup(){

        const router = useRouter();
        const route = useRoute();
        const dialogVisible = ref(false);
        const title = ref('')

        const abstractEl = ref();
        const abstract = ref('請輸入計畫摘要')
        

        async function goBack(){
            router.replace('/experiment-records').catch((e)=>{})
        }
        
        const activeNames = ref([])
        const options = computed(()=>{
            return expConfig.map(i => {
                return { label: i.title, value: i.key }
            })
        })

        onMounted(async ()=>{
            await getData();
        })

        // main function
        const dataSet = ref([]);

        async function getData(){
            const res = await axios.post('/api/experimentRecords/user/getSpecificData',{
                targetRecord: route.query.targetRecord
            },
            {
                headers:{
                    'x-user-token': jsCookie.get('authToken')
                }
            })
            dataSet.value = res.data?.data?.dataSet;
            title.value = res.data?.data?.title;
            abstract.value = res.data?.data?.abstract || '請輸入計畫摘要'
        }

        // 新增子項目
        const insert_order = ref(null);
        const selected_option = ref(null);

        function openAdd(targer_order){
            insert_order.value = targer_order;
            dialogVisible.value = true;
        }

        async function addItem() {
            if (!selected_option.value || (insert_order.value === null || insert_order.value === undefined)) return;

            const config = expConfig.find(i => i.key == selected_option.value);
            if (!config) {
                return eventBus.emit('handleAlert', { 
                    title: '新增站點資訊', 
                    message: '新增站點失敗（參數配置異常）', 
                    type: 'error' 
                });
            }

            const initialFormData = {};
            config.params.forEach(p => {
                initialFormData[p.params] = p.type === Number ? null : '';
            });

            dataSet.value.splice(insert_order.value, 0, {
                token: uuidv4(),
                key: config.key,
                title: config.title,
                params: config.params,
                formData: initialFormData
            });

            selected_option.value = null;
            insert_order.value = null;
            dialogVisible.value = false;
        }

        // 刪除子項目
        async function removeItem(token){
            try{
                await ElMessageBox.confirm('確認刪除站點資訊?','刪除站點',
                    {
                        confirmButtonText: '刪除',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )
                
                const index = dataSet.value.findIndex(i => i.token === token)
                if (index !== -1) dataSet.value.splice(index, 1);  
                else eventBus.emit('handleAlert', { title:'刪除站點資訊', message: '刪除站點失敗（參數配置異常）', type: 'error' })
            }
            catch(e){}
        }

        function move(token, method) {

            const index = dataSet.value.findIndex(i => i.token === token)

            if (method === 'up' && index > 0) {
                const temp = dataSet.value[index]
                dataSet.value[index] = dataSet.value[index - 1]
                dataSet.value[index - 1] = temp
            }

            if (method === 'down' && index < dataSet.value.length - 1) {
                const temp = dataSet.value[index]
                dataSet.value[index] = dataSet.value[index + 1]
                dataSet.value[index + 1] = temp
            }
        }

        // 重新命名
        async function rename(){
            try{
                const { value } = await ElMessageBox.prompt('請輸入計畫名稱？', '重新命名',
                    {
                        confirmButtonText: '確認',
                        cancelButtonText: '取消',
                        type: 'warning',
                        inputValue: title.value
                    }
                )

                const res = await axios.put('/api/experimentRecords/user/rename',{ targetRecord: route.query.targetRecord, name: value },{
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                })
                eventBus.emit('handleAlert', { title:'實驗計畫重新命名結果', message: res.data.message, type: res.data.type })
                await getData();
            }
            catch(e){}
        }
        // 儲存
        async function save(){
            try{
                await ElMessageBox.confirm('確認變更參數？', '變更參數',
                    {
                        confirmButtonText: '確認',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )
                abstract.value = abstractEl.value.innerHTML;
                
                const res = await axios.post('/api/experimentRecords/user/save',{ targetRecord: route.query.targetRecord, dataSet: dataSet.value, abstract: abstract.value },{
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                })
                eventBus.emit('handleAlert', { title:'實驗計畫儲存結果', message: res.data.message, type: res.data.type })
                await getData();
            }
            catch(e){}
        }
        
        return {
            dataSet, goBack, save, title, activeNames, options,
            PlusIcon, ChevronUpIcon, ChevronDownIcon, TrashIcon,
            dialogVisible, selected_option, addItem, openAdd,
            removeItem, move, EditIcon, rename, abstract, abstractEl
        }
    }
}
</script>

<style scoped>
    .edit-experiment-record-wrapper{
        width: 100%;
        height: 100vh;
        box-sizing: border-box;
        padding-left: 20px;
        padding-right: 20px;
    }
    .edit-experiment-record-header{
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
    }
    .edit-experiment-record-title{
        font-size: 24px;
        font-weight: bolder;
        display: flex;
        gap: 7.5px;
    }
    .edit-experiment-record-title-icon:hover{
        cursor: pointer;
    }
    .edit-experiment-record-right{
        margin-left: auto;
        display: flex;
        align-items: center;
        width: fit-content;
        gap: 10px;
    }
    .edit-experiment-record-button>.el-button{
        padding: 20px 15px 20px 15px;
    }
    .edit-experiment-record-table{
        height: calc(100% - 80px);
        overflow-y: scroll;
    }
    /* exp-abstract */
    .edit-experiment-record-abstract{
        width: 100%;
        min-height: 50px;
        max-height: 200px;
        overflow-y: scroll;
        outline: 0;
        font-size: 14px;
        line-height: 1.5;
        margin-bottom: 17.5px;
        color: rgba(210, 210, 210) !important;
    }
    /* exp-params */
    .edit-experiment-record-initialize{
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .edit-experiment-record-initialize:hover{
        cursor: pointer;
        background: rgba(0,0,0,0.01);
    }

    .exp-params-item-function-block{
        display: flex;
        justify-content: right;
        padding-right: 6px;
        gap: 5px;
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    .exp-params-item-function-icon{
        opacity: 0.25;
        transition: opacity 0.5s ease;
    }
    .exp-params-item-function-icon:hover{
        cursor: pointer;
        opacity: 1;
    }
    .exp-params-item-wrapper:hover .exp-params-item-function-block{
        opacity: 1;
    }
    :deep(.el-input__inner){
        text-align: center;
    }
</style>