// for /member-setting

// 全頁驗證機制
const express = require('express');
const router = express.Router();

const userModel = require('../../models/userModel');

const {format} = require('date-fns');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const { baseDir } = require('../../config/pathConfig');
const path = require('path');

const authMiddleware = require('../../middleware/auth.middleware');
const { tokenCache } = require('../../cache/cache');


// 獲取資料
router.get('/api/memberSetting/getData', authMiddleware(10), async (req, res) => {

    try {
        const users = await userModel.find({});

        const output = users.map((user) =>{
            return {
                createTime: user.createTime,
                level: user.level,
                name: user.name,
                id_card: user.detail.idCard || '-',
                ip: user.historyRecord[user.historyRecord.length - 1]?.ip || '-',
                status: user.status,
                token: user.token,
            }
        })
        return res.send({
            type:'success',
            data: output,
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

// 新增用戶
router.post('/api/memberSetting/register', authMiddleware(10), async (req, res) => {

    const token =  uuidv4();
    let { name, account, password, level } = req.body;

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
            message:'用戶註冊成功。' 
        });

    } catch (e) {
        console.log(e)
        return res.send({
            type:'error',
            message:'伺服器錯誤，請洽客服人員協助。'
        });
    }
});

// 凍結用戶
router.put('/api/memberSetting/freeze', authMiddleware(10), async (req, res) => {

    let { targetUser } = req.body;

    if (!targetUser) {
        return res.send({
            type:'error', message:'使用者狀態修改失敗（資料為空）。'
        });
    }

    try {

        const existingUser = await userModel.findOne({ token: targetUser });
        if (!existingUser) {
            return res.send({
                type:'error', message:'使用者狀態修改失敗（用戶不存在）。'
            });
        }

        existingUser.status = !existingUser.status;

        await existingUser.save();

        tokenCache.set(existingUser.token, existingUser);

        return res.send({
            type:'success', message:'使用者狀態修改成功。' 
        });

    } catch (e) {
        console.log(e)
        return res.send({
            type:'error', message:'伺服器錯誤，請洽客服人員協助。'
        });
    }
});

// 刪除用戶
router.post('/api/memberSetting/delete', authMiddleware(10), async (req, res) => {

    let { targetUser } = req.body;

    if (!targetUser) {
        return res.send({
            type:'error', message:'用戶刪除失敗（資料為空）。'
        });
    }

    try {

        const deletedUser = await userModel.findOneAndDelete({ token: targetUser });

        if (!deletedUser) {
            return res.send({
                type: 'error',
                message: '用戶刪除失敗（用戶不存在）。'
            });
        }

        tokenCache.delete(deletedUser.token)

        return res.send({
            type:'success', message:'使用者刪除成功。' 
        });

    } catch (e) {
        console.log(e)
        return res.send({
            type:'error', message:'伺服器錯誤，請洽客服人員協助。'
        });
    }
});




module.exports = router;