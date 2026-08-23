// for /login

// 全頁驗證機制
const express = require('express');
const router = express.Router();

const userModel = require('../models/userModel');

const {format} = require('date-fns');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');


const { baseDir } = require('../config/pathConfig');
const path = require('path');

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

// 註冊驗證
router.post('/login/register', async (req, res) => {

    const token =  uuidv4();
    let { name, account, password, level  } = req.body;

    if (!account || !password) {
        return res.send({
            type:'error',
            message:'註冊資料不可為空。'
        });
    }

    try {

        const existingUser = await userModel.findOne({ account });
        if (existingUser) {
            return res.send({
                type:'error',
                message:'帳號已存在，請選擇其他帳號。'
            });
        }

        const avatorDataBaseUrl = path.join(baseDir,'avator');
        fs.mkdirSync(avatorDataBaseUrl, { recursive: true });
        
        const newUser = new userModel({
            createTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            token,
            status: true,
            level,
            account,
            password,
            name,
        });

        await newUser.save();

        return res.send({
            type:'success',
            message:'註冊成功。' 
        });

    } catch (e) {
        console.log(e)
        return res.send({
            type:'error',
            message:'伺服器錯誤，請洽客服人員協助。'
        });
    }
});

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
            return res.send({
                type:'error',
                message:'帳號或密碼錯誤。'
            });
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

    if (!save && cachedUser) {
        return res.send({ type: 'success', message: '登入成功！', showAlert: false });
    }

    try {
        let user;

        if (save) {
            const loginTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
            const history = historyGenerator(req);

            user = await userModel.findOneAndUpdate(
                { token },
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
            user = await userModel.findOne({ token }).lean();
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