// for /lab-setting

// 全頁驗證機制
const express = require('express');
const router = express.Router();

const labModel = require('../../../models/labModel');
const userModel = require('../../../models/userModel');

const {format} = require('date-fns');
const { v4: uuidv4 } = require('uuid');

const authMiddleware = require('../../../middleware/auth.middleware');


// 獲取實驗室  **待新增對帳單統計
router.get('/api/labSetting/admin/getData', authMiddleware(10), async (req, res) => {

    try {

        const users = await userModel.find({});
        const labs = await labModel.find({});

        // 統計各個 Lab 的成員數量
        const memberCountsMap = {};
        users.forEach((user) => {
            if (!user.lab) return;
            memberCountsMap[user.lab] = (memberCountsMap[user.lab] || 0) + 1;
        });

        const output = labs.map((lab) => {
            return {
                createTime: lab.createTime,
                token: lab.token,
                name: lab.name,
                status: lab.status,
                detailed: lab.detailed,
                memberCounts: memberCountsMap[lab.token] || 0
            }
        });

        return res.send({
            type: 'success',
            data: output,
            message: '實驗室列表獲取成功！'
        });
        
    } catch (e) {
        console.log(e);

        return res.send({
            type: 'error',
            message: '伺服器錯誤，請洽客服人員協助。'
        });
    }
});

// 新增實驗室
router.post('/api/labSetting/admin/register', authMiddleware(10), async (req, res) => {

    const token =  uuidv4();
    let { name } = req.body;

    if (!name) {
        return res.send({
            type:'error',
            message:'註冊資料不可為空。'
        });
    }

    try {

        const existingLab = await labModel.findOne({ name });
        if (existingLab) {
            return res.send({
                type:'error',
                message:'實驗室已存在，請選擇其他實驗室名稱。'
            });
        }
        
        const newLab = new labModel({
            createTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            token,
            name,
            status: true,
        });

        await newLab.save();

        return res.send({
            type:'success',
            message:'實驗室註冊成功。' 
        });

    } catch (e) {
        console.log(e)
        return res.send({
            type:'error',
            message:'伺服器錯誤，請洽客服人員協助。'
        });
    }
});

// 凍結實驗室 -- 待新增移除相關的預約資訊
router.put('/api/labSetting/admin/freeze', authMiddleware(10), async (req, res) => {

    let { targetLab } = req.body;

    if (!targetLab) {
        return res.send({
            type:'error', message:'實驗室狀態修改失敗（資料為空）。'
        });
    }

    try {

        const existingLab = await labModel.findOne({ token: targetLab });
        if (!existingLab) {
            return res.send({
                type:'error', message:'實驗室狀態修改失敗（用戶不存在）。'
            });
        }

        existingLab.status = !existingLab.status;

        await existingLab.save();

        return res.send({
            type:'success', message:'實驗室狀態修改成功。' 
        });

    } catch (e) {
        console.log(e)
        return res.send({
            type:'error', message:'伺服器錯誤，請洽客服人員協助。'
        });
    }
});

// 刪除實驗室
router.post('/api/labSetting/admin/delete', authMiddleware(10), async (req, res) => {

    let { targetLab } = req.body;

    if (!targetLab) {
        return res.send({
            type:'error',
            message:'實驗室刪除失敗（資料為空）。'
        });
    }

    try {

        // 檢查實驗室是否存在
        const lab = await labModel.findOne({ token: targetLab });

        if (!lab) {
            return res.send({ type: 'error', message: '實驗室刪除失敗（實驗室不存在）。'});
        }

        // 檢查該 Lab 是否還有成員
        const labMemberCount = await userModel.countDocuments({ lab: targetLab });
        if (labMemberCount > 0) {
            return res.send({ type: 'error', message: `實驗室刪除失敗，尚有 ${labMemberCount} 位成員。`});
        }

        // 確認無成員後刪除 Lab
        await labModel.deleteOne({ token: targetLab });

        return res.send({ type:'success',  message:'實驗室刪除成功。' });

        } catch (e) {
            console.log(e);
            return res.send({ type:'error', message:'伺服器錯誤，請洽客服人員協助。'});
        }
});

// 修改實驗室
router.post('/api/labSetting/admin/revise', authMiddleware(10), async (req, res) => {

    let { targetLab, name, mailAddress, phoneNumber, location } = req.body;

    if (!name) {
        return res.send({
            type:'error',
            message:'註冊資料不可為空。'
        });
    }

    try {

        // 檢查是否與其他實驗室重名
        const existingLab = await labModel.findOne({ name });
        if (existingLab && existingLab.token != targetLab) {
            return res.send({
                type:'error',
                message:'實驗室已存在，請選擇其他實驗室名稱。'
            });
        }

        const lab = await labModel.findOne({ token: targetLab })

        if(!lab){
            return res.send({
                type:'error',
                message:'實驗室不存在。'
            });
        }
        
        lab.name = name;
        lab.phoneNumber = phoneNumber;
        lab.mailAddress = mailAddress;
        lab.location = location;

        await lab.save();

        return res.send({
            type:'success',
            message:'實驗室資料修改成功。' 
        });

    } catch (e) {
        console.log(e)
        return res.send({
            type:'error',
            message:'伺服器錯誤，請洽客服人員協助。'
        });
    }
});


// 獲取特定實驗室資料 -- 實驗室基本資料
router.post('/api/labSetting/admin/getSpecificData', authMiddleware(10), async (req, res) => {

    const { targetLab } = req.body;

    try {

        const lab = await labModel.findOne({ token: targetLab });
        if(!lab){
            return res.send({
                type:'success',
                data: {},
                message:'實驗室資料不存在。'
            });
        }
        
        const output = {
            name: lab.name,
            phoneNumber: lab.phoneNumber,
            mailAddress: lab.mailAddress,
            location: lab.location
        }

        return res.send({
            type:'success',
            data: output,
            message:'實驗室資料獲取成功！'
        });
        
    } catch (e) {
        console.log(e)
        return res.send({
            type:'error',
            message:'伺服器錯誤，請洽客服人員協助。'
        });
    }
});

// 獲取特定實驗室資料 -- 實驗室成員列表
router.post('/api/labSetting/admin/getSpecificData/labMember', authMiddleware(10), async (req, res) => {

    const { targetLab } = req.body;

    try {

        const users = await userModel.find({ lab: targetLab });

        const output = users.map((user) => {
            return {
                token: user.token,
                name: user.name,
                status: user.status,
            }
        })

        return res.send({
            type:'success',
            data: output,
            message:'實驗室成員列表獲取成功！'
        });
        
    } catch (e) {
        console.log(e)
        return res.send({
            type:'error',
            message:'伺服器錯誤，請洽客服人員協助。'
        });
    }
});





module.exports = router;