<template>
    <div class="user-login-wrapper">
        <div class="user-login-input-box-wrapper">
            <img class="user-login-img" src="logo/logo_banner.png" alt="">
            <div class="user-login-input-box-flex">
                <div class="user-login-input-box-title">會員登入</div>
                <div class="user-login-input-box-input-wrapper-all">
                    <div class="user-login-input-box-input-wrapper">
                        <div class="user-login-input-box-input-title">帳號：</div>
                        <input class="user-login-input-box-input" v-model="account">
                    </div>
                    <div class="user-login-input-box-input-wrapper">
                        <div class="user-login-input-box-input-title">密碼：</div>
                        <input class="user-login-input-box-input" v-model="password" type="password">
                    </div>
                </div>
            </div>
            <div class="send-button">
                <VButton type="info" @click="login">會員登入</VButton>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { VButton } from 'vorium-ui'
import 'vorium-ui/dist/vorium-ui.css'
import axios from 'axios';
import { eventBus } from '@/utils/eventBus'
import { useRouter, useRoute } from 'vue-router';


export default {
    name: 'UserLogin',
    components:{
        VButton
    },
    setup(){
        const router = useRouter();
        const route = useRoute();

        const account = ref('');
        const password = ref('');

        async function login(){

            if((account.value).trim() == '' || (password.value).trim() == '') return;

            const res = await axios.post('/login/verify',{
                account: account.value, 
                password: password.value
            })

            eventBus.emit('handleAlert', { title:'用戶登入資訊', message: res.data.message, type: res.data.type })
            
            if(res.data.type == 'success'){
                const redirect = route.query.redirect || '/'
                router.replace(redirect)
            }

        }

        return {
            account, password, login
        }
    }
}
</script>

<style scoped>
    .user-login-wrapper{
        width: 100%;
        height: 100vh;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .user-login-input-box-wrapper{
        width: 680px;
        border-radius: 10px;
        box-shadow: 3px 3px 50px rgba(0,0,0,0.12);
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
        padding-bottom: 60px;
    }
    .user-login-img{
        width: 75%;
        margin: 0 auto;
        margin-top: 40px;
        margin-bottom: 40px;
    }
    .user-login-input-box-flex{
        width: 75%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
    }
    .user-login-input-box-title{
        font-size: 28px;
        margin-bottom: 30px;
        width: 40%;
        flex-shrink: 0;
        padding-left: 10px;
        box-sizing: border-box;
    }
    .user-login-input-box-input-wrapper-all{
        width: 100%;
    }
    .user-login-input-box-input-wrapper{
        width: 100%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap:10px;
        height: 40px;
        margin-bottom: 20px;
    }
    .user-login-input-box-input-title{
        width: fit-content;
        flex-shrink: 0;
    }
    .user-login-input-box-input{
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding-left: 5px;
        padding-right: 5px;
        border: 0;
        border-bottom: 1px solid rgba(0,0,0,0.12);

    }
    .user-login-input-box-input:focus{
        outline: 0;
    }
    .send-button{
        width: 75%;
        margin-top: 50px;
    }
</style>