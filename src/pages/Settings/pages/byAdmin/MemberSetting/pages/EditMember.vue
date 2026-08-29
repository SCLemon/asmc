<template>
    <div class="member-setting-edit-wrapper">
        <div class="member-setting-edit-header">
            <div class="member-setting-edit-title">User Profile</div>
            <div class="member-setting-edit-right">
                <div class="member-setting-edit-button"><el-button @click="send()" type="primary">儲存資訊</el-button></div>
                <div class="member-setting-edit-button" v-if="method != 'add'"><el-button @click="freeze()" type="warning">{{user.status ? '凍結帳號': '解凍帳號'}}</el-button></div>
                <div class="member-setting-edit-button"><el-button @click="goBack()">返回列表</el-button></div>
            </div>
        </div>
        <div class="member-setting-edit-table-wrapper">
            <div class="member-setting-edit-input-wrapper">
                <div class="member-setting-edit-input-title">帳號：</div>
                <el-input v-model="user.account" style="width: 100%; height: 40px;" clearable placeholder="Enter Account" :disabled="method != 'add'" />
            </div>
            <div class="member-setting-edit-input-wrapper">
                <div class="member-setting-edit-input-title">密碼：</div>
                <el-input v-model="user.password" type="password" show-password clearable style="width: 100%; height: 40px;" placeholder="Enter Password" />
            </div>
            <div class="member-setting-edit-input-wrapper">
                <div class="member-setting-edit-input-title">姓名：</div>
                <el-input v-model="user.name" style="width: 100%; height: 40px;" clearable placeholder="Enter Username" />
            </div>
            <div class="member-setting-edit-input-wrapper">
                <div class="member-setting-edit-input-title">信箱：</div>
                <el-input v-model="user.mailAddress" style="width: 100%; height: 40px;" clearable placeholder="Enter mailAddress (Optional)" />
            </div>
            <div class="member-setting-edit-input-wrapper">
                <div class="member-setting-edit-input-title">電話：</div>
                <el-input v-model="user.phoneNumber" style="width: 100%; height: 40px;" clearable placeholder="Enter phoneNumber (Optional)" />
            </div>
            <div class="member-setting-edit-input-wrapper">
                <div class="member-setting-edit-input-title">卡號：</div>
                <el-input v-model="user.idCard" style="width: 100%; height: 40px;" clearable placeholder="Enter Card ID (Optional)" />
            </div>
            <div class="member-setting-edit-input-wrapper">
                <div class="member-setting-edit-input-title">隸屬：</div>
                <el-select v-model="user.lab" placeholder="Select Lab" style="width: 100%;">
                    <el-option v-for="item in lab_options" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
            </div>
            <div class="member-setting-edit-input-wrapper">
                <div class="member-setting-edit-input-title">權限：</div>
                <el-select v-model="user.level" placeholder="Select" style="width: 100%;">
                    <el-option v-for="item in level_options" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
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
import { ElMessageBox } from 'element-plus'
export default {
    name: 'EditMember',
    setup(){
        
        const router = useRouter();
        const route = useRoute();
        
        const method = route.query.method;
        const targetUser = route.query.targetUser;

        const user = ref({
            account:'',
            password:'',
            level: 1,
            name: '',
            lab: '',
            phoneNumber:'',
            mailAddress:'',
            idCard: '',
        })

        const lab_options = ref([])

        const level_options = [
            {
                value: 1,
                label: '其他實驗室成員',
            },
            {
                value: 4,
                label: 'ASMC 實驗室成員',
            },
            {
                value: 10,
                label: '平台管理員',
            },
        ]


        onMounted(async ()=>{
            await getData();
            await getLabList();
        })

        async function getData(){
            const res = await axios.post('/api/memberSetting/admin/getSpecificData',{ targetUser },{
                headers:{
                    'x-user-token': jsCookie.get('authToken')
                }
            })
            user.value = res.data.data || {};
            
            if(res.data.type == 'error') eventBus.emit('handleAlert', { title:'用戶資料獲取結果', message: res.data.message, type: res.data.type })
        }

        async function getLabList(){
            const res = await axios.get('/api/memberSetting/admin/getLabList',{
                headers:{
                    'x-user-token': jsCookie.get('authToken')
                }
            })
            lab_options.value = res.data.data?.map((lab)=>{
                return {
                    label: lab.name,
                    value: lab.token
                }
            })
        }

        async function send(){
            if(method == 'add') await register();
            else if(method == 'revise') await revise();
            else eventBus.emit('handleAlert', { title:'執行結果', message: '執行失敗（參數遺失）', type: 'error' })
        }

        async function register(){

            const res = await axios.post('/api/memberSetting/admin/register', user.value,
            {
                headers: {
                    'x-user-token': jsCookie.get('authToken')
                }
            })

            eventBus.emit('handleAlert', { title:'用戶註冊資訊', message: res.data.message, type: res.data.type })
            
            if(res.data.type == 'success') goBack();
        }

        async function freeze(){
            try{
                await ElMessageBox.confirm('確認凍結/解凍用戶？', '修改權限',
                    {
                        confirmButtonText: '確認',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )
                const res = await axios.put('/api/memberSetting/admin/freeze',{ targetUser },{
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                })
                eventBus.emit('handleAlert', { title:'用戶狀態修改', message: res.data.message, type: res.data.type })
                await getData();
            }
            catch(e){
                
            }
        }

        async function revise(){
            const input = {
                targetUser,
                ...user.value
            }
            const res = await axios.post('/api/memberSetting/admin/revise', input,
            {
                headers: {
                    'x-user-token': jsCookie.get('authToken')
                }
            })

            eventBus.emit('handleAlert', { title:'用戶資料修改結果', message: res.data.message, type: res.data.type })
            
            if(res.data.type == 'success') goBack();
        }

        function goBack(){
            const redirect = route.query.redirect || '/settings/admin/member-setting'
            router.replace(redirect).catch((e)=>{})
        }

        return {
            method, user, level_options, lab_options, send, goBack, freeze
        }
    }
}
</script>

<style scoped>
    .member-setting-edit-wrapper{
        width: 100%;
        height: 100vh;
        box-sizing: border-box;
        padding-left: 20px;
        padding-right: 20px;
    }
    .member-setting-edit-header{
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
    }
    .member-setting-edit-title{
        font-size: 24px;
        font-weight: bolder;
    }
    .member-setting-edit-right{
        margin-left: auto;
        display: flex;
        align-items: center;
        width: fit-content;
        gap: 10px;
    }
    .member-setting-edit-button>.el-button{
        padding: 20px 15px 20px 15px;
    }

    .member-setting-edit-table-wrapper{
        width: 100%;
        margin-top: 15px;
    }
    .member-setting-edit-input-wrapper{
        width: 100%;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        margin-bottom: 20px;
        gap:20px;
    }
    .member-setting-edit-input-title{
        flex-shrink: 0;
    }
    :deep(.el-select__wrapper){
        height: 40px;
    }
</style>