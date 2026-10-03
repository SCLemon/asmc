<template>
    <div class="equipment-detail-wrapper">
        <div class="equipment-detail-editor-wrapper">
            <div class="equipment-detail-editor-input-wrapper">
                <div class="equipment-detail-editor-input-title">儀器名稱：</div><el-input v-model="info.name" type="text" style="width: 100%; height: 40px;"></el-input>
            </div>
            <div class="equipment-detail-editor-input-wrapper-2">
                <div class="equipment-detail-editor-input">
                    <div class="equipment-detail-editor-input-title">費率（hr）：</div>
                    <el-input-number v-model="info.rate" style="width: 100%; height: 40px;" />
                </div>
                <div class="equipment-detail-editor-input">
                    <div class="equipment-detail-editor-input-title">管理員：</div>
                    <el-select v-model="info.superUser" placeholder="Select" style="width: 100%;" disabled>
                        <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                </div>
                <div class="equipment-detail-editor-button">
                    <el-button type="primary" @click="revise()">儲存資訊</el-button>
                    <el-button type="warning" @click="info?.status ? freeze(): restart()">{{ info?.status ? '停用' : '重啟' }}儀器</el-button>
                    <el-button type="danger" @click="remove()">刪除儀器</el-button>
                </div>
            </div>
        </div>
        <div class="equipment-detail-picker-wrapper">
            <div class="equipment-detail-picker-block equipment-detail-picker-block-1">
                <div class="equipment-detail-user-picker-title">授權名單</div>
                <el-transfer v-model="info.users"  :titles="['Unauthorized', 'Authorized']"  filterable filter-placeholder="Search By Name" :data="userList"/>
            </div>
            <div class="equipment-detail-picker-block equipment-detail-picker-block-2">
                <div class="equipment-detail-user-picker-title">預約現況</div>
                <equipment-reservation :target-equipment="targetEquipment"></equipment-reservation>
            </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios';
import jsCookie from 'js-cookie';
import { eventBus } from '@/utils/eventBus.js';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import EquipmentReservation from './EquipmentReservation.vue';
import { ElMessageBox } from 'element-plus';
export default {
    name: 'EquipmentDetail',
    components:{
        EquipmentReservation
    },
    props:{
        targetEquipment:{
            type: String,
            default: '',
        }
    },
    setup(props){

        const router = useRouter();

        const info = ref({ name: '', rate: 0 , status: true, superUser: '', users:[], reservation: [] })

        const userList = ref([]);

        onMounted(async ()=>{
            await getUserList();
        })

        async function getData(){
            try{
                const res = await axios.post('/api/equipmentSetting/superUser/getSpecificData',{ targetEquipment: props.targetEquipment },{
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                info.value = res.data.data;
                if(res.data.type == 'error') eventBus.emit('handleAlert', { title:'儀器獲取資訊', message: res.data.message, type: res.data.type })
            }
            catch(e){}
        }
        async function getUserList(){
            try{
                const res = await axios.get('/api/equipmentSetting/superUser/getUserList',{
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                if(res.data.type == 'success') {
                    userList.value = res.data.data;
                }
            }
            catch(e){}
        }
        async function revise(){
            const input = {
                targetEquipment: props.targetEquipment,
                ...info.value
            }
            try{
                const res = await axios.post('/api/equipmentSetting/superUser/revise',input,{
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                eventBus.emit('handleAlert', { title:'儀器修改結果', message: res.data.message, type: res.data.type })
                await getData();
            }
            catch(e){}
        }

        async function freeze(){
            try{

                await ElMessageBox.confirm('確認停用儀器？', '停用儀器',
                    {
                        confirmButtonText: '確認',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )

                const res = await axios.put('/api/equipmentSetting/superUser/freeze',{ targetEquipment: props.targetEquipment },{
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                eventBus.emit('handleAlert', { title:'儀器停用結果', message: res.data.message, type: res.data.type })
                await getData();
            }
            catch(e){}
        }
        async function restart(){
            
            try{

                await ElMessageBox.confirm('確認重啟儀器？', '重啟',
                    {
                        confirmButtonText: '確認',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )

                const res = await axios.put('/api/equipmentSetting/superUser/restart',{ targetEquipment: props.targetEquipment },{
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                eventBus.emit('handleAlert', { title:'儀器重啟結果', message: res.data.message, type: res.data.type })
                await getData();
            }
            catch(e){}
        }

        async function remove(){
            try{
                
                await ElMessageBox.confirm('確認刪除儀器？', '刪除儀器',
                    {
                        confirmButtonText: '確認',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )

                const res = await axios.post('/api/equipmentSetting/superUser/delete',{ targetEquipment: props.targetEquipment },{
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                eventBus.emit('handleAlert', { title:'儀器刪除結果', message: res.data.message, type: res.data.type })
                if(res.data.type == 'success') router.replace('/settings').catch(e=>{})
            }
            catch(e){}
        }


        watch(()=> props.targetEquipment, async ()=>{
            if(props.targetEquipment) await getData();
        },
        { immediate: true, deep: true })



        return {
            info, userList, revise, freeze, restart, remove
        }
    }
}
</script>

<style scoped>
    .equipment-detail-wrapper{
        width: 100%;
        height: calc(100vh - 80px);
        box-sizing: border-box;
        padding-top: 10px;
    }
    .equipment-detail-editor-wrapper{
        width: 100%;
        margin-bottom: 40px;
        box-sizing: border-box;
    }
    .equipment-detail-editor-input-wrapper{
        display: flex;
        align-items: center;
        gap: 10px;
        height: 40px;
        margin-bottom: 25px;
    }
    .equipment-detail-editor-input-wrapper-2{
        display: flex;
        align-items: center;
        gap: 25px;
        height: 40px;
    }
    .equipment-detail-editor-input{
        width: 100%;
        display: flex;
        align-items: center;
        gap:10px;

    }
    .equipment-detail-editor-input-title{
        flex-shrink: 0;
    }
    .equipment-detail-editor-button{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: right;
    }
    .equipment-detail-editor-button>.el-button{
        padding: 20px 15px 20px 15px;
    }

    .equipment-detail-picker-wrapper{
        width: 100%;
        display: flex;
    }
    .equipment-detail-user-picker-title{
        height: 40px;
        font-weight: bolder;
        font-size: 18px;
    }
    .equipment-detail-picker-block{
        width: 50%;
        flex-shrink: 0;
    }
    .equipment-detail-picker-block-1{
        min-width: 650px;
    }
    :deep(.el-transfer-panel) {
        height: 450px;
        width: 225px;
    }

    :deep(.el-transfer-panel__body) {
        height: 400px;
    }
    @media screen and (max-width:1024px) {
        .equipment-detail-picker-wrapper{
            flex-wrap: wrap;
        }
        .equipment-detail-picker-block{
            width: 100%;
        }
        .equipment-detail-picker-block-2{
            margin-top: 15px;
        }
    }
</style>