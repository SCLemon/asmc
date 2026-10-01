<template>
  <div class="affidavit-wrapper">
    <div class="affidavit-pdf-box">
      <VPdfViewer :pdfFile="file" />
    </div>
    <div class="affidavit-button-wrapper">
        <div v-if="!(detail?.status)">
            <el-button type="primary" @click="sign()">同意簽署</el-button>
            <el-button @click="goBack()">返回頁面</el-button>
        </div>
        <div v-else>
            <div>已簽署（{{ detail.timestamp }}）</div>
        </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { VPdfViewer } from 'vorium-ui'
import { ElMessage, ElMessageBox } from 'element-plus'
import 'vorium-ui/dist/vorium-ui.css'
import { useRouter } from 'vue-router';
import axios from 'axios'
import jsCookie from 'js-cookie';

export default {
    components: {
        VPdfViewer
    },
    setup(){
        const file = ref(null);
        const router = useRouter();
        const detail = ref({})

        onMounted(async ()=>{
            const response = await fetch('asset/affidavit.pdf')
            const blob = await response.blob()
            file.value = new File([blob], 'affidavit.pdf',{ type: 'application/pdf' })

            await getData();
        })

        async function getData(){
            const res = await axios.get('/api/affidavit/user/getData',{
                headers:{
                    'x-user-token': jsCookie.get('authToken')
                }
            })
            detail.value = res.data.data;
            console.log(detail.value)
            
            if(res.data.type == 'error') eventBus.emit('handleAlert', { title:'用戶資料獲取結果', message: res.data.message, type: res.data.type })
        }

        function goBack(){
            router.replace('/settings').catch(e=>{})
        }

        async function sign(){

            try{
                await ElMessageBox.confirm('確認簽署切結書？', '確認簽署',
                    {
                        confirmButtonText: '簽署',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                )

                const res = await axios.post('/api/affidavit/user/sign',{},
                {
                    headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                })

                if(res.data.type == 'success') await getData();

                eventBus.emit('handleAlert', { title:'切結書簽署結果', message: res.data.message, type: res.data.type })
            }
            catch(e){}
  
        }
        return{
            file, detail, goBack, sign
        }
    }
}
</script>

<style scoped>
    .affidavit-wrapper{
        width: 100%;
        margin: 0 auto;
    }

    /* Automatically matches the size of its parent container. */
    .affidavit-pdf-box{
        width: 100%;
        /* height: 100vh; */
    }

    .affidavit-button-wrapper{
        width: 100%;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    :deep(.el-button){
        height: 40px;
        width: 100px;
    }
</style>