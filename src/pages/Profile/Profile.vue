<template>
    <div class="member-setting-edit-wrapper">
        <div class="member-setting-edit-header">
            <div class="member-setting-edit-title">User Profile</div>
            <div class="member-setting-edit-right">
                <div class="member-setting-edit-button"><el-button @click="revise()" type="primary">儲存資訊</el-button></div>
                <div class="member-setting-edit-button"><el-button @click="logout()" type="danger">登出帳號</el-button></div>
            </div>
        </div>
        <div class="member-setting-edit-table-wrapper">
            <div class="member-setting-edit-input-wrapper">
                <div class="member-setting-edit-input-title">帳號：</div>
                <el-input v-model="user.account" style="width: 100%; height: 40px;" clearable placeholder="Enter Account" :disabled="true"  />
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
                <el-input v-model="user.lab" style="width: 100%; height: 40px;" disabled />
            </div>
            <div class="member-setting-edit-input-wrapper">
                <div class="member-setting-edit-input-title">權限：</div>
                <el-input v-model="level" style="width: 100%; height: 40px;" disabled />
            </div>
        </div>
    </div>
</template>

<script>
import jsCookie from 'js-cookie';
import axios from 'axios';
import { eventBus } from '@/utils/eventBus';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
export default {
    name: 'Profile',
    setup(){
    
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

        const level = computed(()=>{
            return level_options.find(item => item.value === user.value?.level)?.label
        })

        onMounted(async ()=>{
            await getData();
        })

        async function getData(){
            const res = await axios.get('/api/memberSetting/user/getSpecificData',{
                headers:{
                    'x-user-token': jsCookie.get('authToken')
                }
            })
            user.value = res.data.data;
            
            if(res.data.type == 'error') eventBus.emit('handleAlert', { title:'用戶資料獲取結果', message: res.data.message, type: res.data.type })
        }

        async function revise(){

            const res = await axios.post('/api/memberSetting/user/revise', user.value,
            {
                headers: {
                    'x-user-token': jsCookie.get('authToken')
                }
            })

            eventBus.emit('handleAlert', { title:'用戶資料修改結果', message: res.data.message, type: res.data.type })
            
        }

        const router = useRouter();
        function logout(){
            jsCookie.remove('authToken');
            router.replace('/user/login').catch((e)=>{})
        }

        return {
            user, level_options, lab_options, revise, logout, level
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