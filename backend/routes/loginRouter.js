// for /login

const express = require('express');
const router = express.Router();

const userModel = require('../models/userModel');
const {format} = require('date-fns');
const { tokenCache } = require('../cache/cache');

function historyGenerator(req){
    return {
        recordingTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        ip: req.headers['cf-connecting-ip'],
        country: req.headers['cf-ipcountry'],
        city: req.headers['cf-ipcity'],
        latitude: req.headers['cf-iplatitude'],
        longitude: req.headers['cf-iplongitude'],
        timezone: req.headers['cf-timezone']
    };
}

// 登入驗證
router.post('/login/verify', async (req, res) => {
    const { account, password } = req.body;

    if (!account || !password) {
        return res.send({
            type:'error',
            message:'登入資料不可為空。'
        });
    }

    try {
        const user = await userModel.findOne({ account, password });
        if (!user) {
            return res.send({ type:'error', message:'帳號或密碼錯誤。' });
        }
        if(!user.status){
            return res.send({ type:'error', message:'帳號已被停權。' });
        }

        const loginTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        user.lastOnline = loginTime;

        // 使用者歷史資訊
        const history = historyGenerator(req);

        user.historyRecord = [
            ...(user.historyRecord || []),
            history
        ].slice(-100);

        await user.save();

        tokenCache.set(user.token, user);

        res.cookie('authToken',user.token,{
            maxAge:86400 * 1000 * 7, // 7 天
        })

        return res.send({
            type:'success',
            message:'登入成功！'
        });
        
    } catch (e) {
        console.log(e)
        return res.send({
            type:'error',
            message:'伺服器錯誤，請洽客服人員協助。'
        });
    }
});


// token 驗證
router.post('/login/token', async (req, res) => {
    const token = req.headers['x-user-token'];
    const save = req.body.save;

    let cachedUser = tokenCache.get(token);

    if (!save && cachedUser?.status) {
        return res.send({ type: 'success', message: '登入成功！', showAlert: false });
    }

    try {
        let user;

        if (save) {
            const loginTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
            const history = historyGenerator(req);

            user = await userModel.findOneAndUpdate(
                { token, status: true },
                { 
                    $set: { lastOnline: loginTime },
                    $push: { 
                        historyRecord: { 
                            $each: [history],
                            $slice: -100 
                        } 
                    }
                },
                { new: true }
            ).lean();

            if (!user) {
                return res.send({ type: 'error', message: '無效使用者，請重新登入', showAlert: true });
            }
        } 
        else {
            user = await userModel.findOne({ token, status: true }).lean();
            if (!user) {
                return res.send({ type: 'error', message: '無效使用者，請重新登入', showAlert: true });
            }
        }

        tokenCache.set(token, user);

        return res.send({ type: 'success', message: '登入成功！', showAlert: false });
    } 
    catch (e) {
        console.error(e);
        return res.send({ type: 'error', message: '伺服器錯誤', showAlert: true });
    }
});



module.exports = router;