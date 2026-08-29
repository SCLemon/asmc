<template>
    <div class="lab-setting-edit-wrapper">
        <div class="lab-setting-edit-header">
            <div class="lab-setting-edit-title">Lab Infomation</div>
            <div class="lab-setting-edit-right">
                <div class="lab-setting-edit-button"><el-button @click="revise()" type="primary">儲存資訊</el-button></div>
                <div class="lab-setting-edit-button"><el-button @click="goBack()">返回列表</el-button></div>
            </div>
        </div>
        <div class="lab-setting-edit-table-wrapper">
            <div class="lab-setting-edit-input-wrapper">
                <div class="lab-setting-edit-input-title">名稱：</div>
                <el-input v-model="lab.name" style="width: 100%; height: 40px;" clearable placeholder="Enter Name" />
            </div>
            <div class="lab-setting-edit-input-wrapper">
                <div class="lab-setting-edit-input-title">信箱：</div>
                <el-input v-model="lab.mailAddress" style="width: 100%; height: 40px;" clearable placeholder="Enter mailAddress (Optional)" />
            </div>
            <div class="lab-setting-edit-input-wrapper">
                <div class="lab-setting-edit-input-title">電話：</div>
                <el-input v-model="lab.phoneNumber" style="width: 100%; height: 40px;" clearable placeholder="Enter phoneNumber (Optional)" />
            </div>
            <div class="lab-setting-edit-input-wrapper">
                <div class="lab-setting-edit-input-title">地址：</div>
                <el-input v-model="lab.location" style="width: 100%; height: 40px;" clearable placeholder="Enter Location (Optional)" />
            </div>
        </div>
        <div class="lab-setting-edit-detailed-block-wrapper">
            <div class="lab-setting-edit-detailed-block">
                <div class="lab-setting-edit-detailed-block-title">Member List</div>
                <member-table :targetLab="targetLab"></member-table>
            </div>
            <div class="lab-setting-edit-detailed-block">
                <div class="lab-setting-edit-detailed-block-title">Payment Records</div>
                <member-table :targetLab="targetLab"></member-table>
            </div>
        </div>
    </div>
</template>

<script>
import jsCookie from 'js-cookie';
import axios from 'axios';
import { eventBus } from '@/utils/eventBus';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MemberTable from './components/MemberTable.vue';
export default {
    name: 'EditLab',
    components:{
        MemberTable
    },
    setup(){
        
        const router = useRouter();
        const route = useRoute();
        
        const targetLab = route.query.targetLab;

        const lab = ref({
            name: '',
            phoneNumber:'',
            mailAddress:'',
            location: '',
        })


        onMounted(async ()=>{
            await getData();
        })

        async function getData(){
            const res = await axios.post('/api/labSetting/admin/getSpecificData',{ targetLab },{
                headers:{
                    'x-user-token': jsCookie.get('authToken')
                }
            })
            lab.value = res.data.data;
            
            if(res.data.type == 'error') eventBus.emit('handleAlert', { title:'實驗室資料獲取結果', message: res.data.message, type: res.data.type })
        }


        async function revise(){
            const input = {
                targetLab,
                ...lab.value
            }
            const res = await axios.post('/api/labSetting/admin/revise', input,
            {
                headers: {
                    'x-user-token': jsCookie.get('authToken')
                }
            })

            eventBus.emit('handleAlert', { title:'實驗室資料修改結果', message: res.data.message, type: res.data.type })
            
            if(res.data.type == 'success') goBack();
        }

        function goBack(){
            router.replace('/settings/admin/lab-setting').catch((e)=>{})
        }

        return {
            lab, revise, goBack, targetLab
        }
    }
}
</script>

<style scoped>
    .lab-setting-edit-wrapper{
        width: 100%;
        height: 100vh;
        box-sizing: border-box;
        padding-left: 20px;
        padding-right: 20px;
    }
    .lab-setting-edit-header{
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
    }
    .lab-setting-edit-title{
        font-size: 24px;
        font-weight: bolder;
    }
    .lab-setting-edit-right{
        margin-left: auto;
        display: flex;
        align-items: center;
        width: fit-content;
        gap: 10px;
    }
    .lab-setting-edit-button>.el-button{
        padding: 20px 15px 20px 15px;
    }

    .lab-setting-edit-table-wrapper{
        width: 100%;
        margin-top: 15px;
    }
    .lab-setting-edit-input-wrapper{
        width: 100%;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        margin-bottom: 20px;
        gap:20px;
    }
    .lab-setting-edit-input-title{
        flex-shrink: 0;
    }

    .lab-setting-edit-detailed-block-wrapper{
        width: 100%;
        height: calc(100vh - 390px);
        margin-top: 40px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
    }
    .lab-setting-edit-detailed-block{
        height: 100%;
        box-sizing: border-box;
        overflow: hidden;
    }

    .lab-setting-edit-detailed-block-title{
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        font-weight: bolder;
    }
    :deep(.el-select__wrapper){
        height: 40px;
    }
</style>