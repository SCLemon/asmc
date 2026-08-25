// for /lab-setting

// 全頁驗證機制
const express = require('express');
const router = express.Router();

const labModel = require('../../models/labModel');

const {format} = require('date-fns');
const { v4: uuidv4 } = require('uuid');

const authMiddleware = require('../../middleware/auth.middleware');


// 獲取實驗室  **待新增對帳單統計, 實驗室人數統計
router.get('/api/labSetting/getData', authMiddleware(10), async (req, res) => {

    try {
        const labs = await labModel.find({});

        const output = labs.map((lab) =>{
            return {
                createTime: lab.createTime,
                token: lab.token,
                name: lab.name,
                status: lab.status,
                detailed: lab.detailed
            }
        })
        return res.send({
            type:'success',
            data: output,
            message:'實驗室列表獲取成功！'
        });
        
    } catch (e) {
        console.log(e)
        return res.send({
            type:'error',
            message:'伺服器錯誤，請洽客服人員協助。'
        });
    }
});

// 新增實驗室
router.post('/api/labSetting/register', authMiddleware(10), async (req, res) => {

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

// 凍結實驗室
router.put('/api/labSetting/freeze', authMiddleware(10), async (req, res) => {

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

// 刪除實驗室  **待新增若人數不為 0 則不可刪除
router.post('/api/labSetting/delete', authMiddleware(10), async (req, res) => {

    let { targetLab } = req.body;

    if (!targetLab) {
        return res.send({
            type:'error', message:'實驗室刪除失敗（資料為空）。'
        });
    }

    try {

        const deletedLab = await labModel.findOneAndDelete({ token: targetLab });

        if (!deletedLab) {
            return res.send({
                type: 'error',
                message: '實驗室刪除失敗（實驗室不存在）。'
            });
        }

        return res.send({
            type:'success', message:'實驗室刪除成功。' 
        });

    } catch (e) {
        console.log(e)
        return res.send({
            type:'error', message:'伺服器錯誤，請洽客服人員協助。'
        });
    }
});



module.exports = router;