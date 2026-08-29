<template>
    <div class="parameter-wrapper">
        <table class="parameter-table" v-if="tableData?.length">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(member, id) in tableData" :key="id" @click.stop="goToMemberDetail(member.token)">
                    <td>{{ member.name }}</td>
                    <td>
                        <div v-if="member.status" style="color: lightgreen;">有效</div>
                        <div v-else style="color: rgba(0,0,0,0.2);">凍結</div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { eventBus } from '@/utils/eventBus';
import axios from 'axios';
import jsCookie from 'js-cookie';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
    name: 'MemberTable',
    props:{
        targetLab:{
            type: String,
            required: true,
        }
    },
    setup(props){
        
        const router = useRouter();

        const tableData = ref([]);

        onMounted(async ()=>{
            await getData();
        })

        async function getData(){
            const res = await axios.post('/api/labSetting/admin/getSpecificData/labMember',{ targetLab: props.targetLab },{
                headers:{
                    'x-user-token': jsCookie.get('authToken')
                }
            })
            tableData.value = res.data.data
        }
        
        function goToMemberDetail(token){
            router.replace({
                path: '/settings/admin/member-setting/edit',
                query: { 
                    'method': 'revise',
                    'targetUser': token,
                    'redirect': `/settings/admin/lab-setting/edit?targetLab=${props.targetLab}`
                }
            }).catch((e)=>{})
        }

        return {
            tableData, getData, goToMemberDetail
        }
    }
}
</script>

<style scoped>
    .parameter-wrapper{
        box-sizing: border-box;
        overflow-y: scroll;
        height: 100%;
    }
    .parameter-table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        text-align: left;
    }
    .parameter-table th {
        position: sticky;
        top: 0;
        background: white;
        z-index: 2;
    }
    .parameter-table th,td {
        padding-top: 15px;
        padding-bottom: 15px;
        padding-right: 15px;
        box-sizing: border-box;
        line-height: 1.5;
        font-size: 14px;
    }

    .parameter-table thead{
        box-sizing: border-box;
        border-bottom: 1px solid rgba(0, 0, 0, 0.02);
        font-weight: bolder;
    }

    .parameter-table th:nth-child(1),
    .parameter-table td:nth-child(1) {
        width: 17.5%;
        padding-left: 5px;
        word-break: break-all;
    }

    .parameter-table th:nth-child(2),
    .parameter-table td:nth-child(2) {
        width: 15%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(3),
    .parameter-table td:nth-child(3) {
        width: 10%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(4),
    .parameter-table td:nth-child(4) {
        width: 15%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(5),
    .parameter-table td:nth-child(5) {
        width: 15%;
        word-break: break-all;
    }

    .parameter-table th:nth-child(6),
    .parameter-table td:nth-child(6) {
        width: 22.5%;
        word-break: break-all;
    }

    .parameter-table tbody tr {
        transition: background-color 0.25s ease;
    }

    .parameter-table tbody tr:hover {
        background: rgba(0, 0, 0, 0.02);
        cursor: pointer;
    }
    .options>.el-button{
        padding: 17.5px 17.5px;
    }
</style>