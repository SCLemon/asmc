// for /equipment-setting

// 全頁驗證機制
const express = require('express');
const router = express.Router();

const userModel = require('../../../models/userModel');
const equipmentModel = require('../../../models/equipmentModel');

const {format} = require('date-fns');
const { v4: uuidv4 } = require('uuid');

const authMiddleware = require('../../../middleware/auth.middleware');

// 獲取儀器列表 -- ok
router.get('/api/equipmentSetting/admin/getData', authMiddleware(10), async (req, res) => {

    try {
        const equipments = await equipmentModel.find({ isDeleted: false })
        const output = equipments.map((equipment) =>{
            return {
                value: equipment.token,
                label: equipment.name,
            }
        })

        return res.send({
            type:'success',
            data: output,
            message:'儀器列表獲取成功！'
        });
        
    } catch (e) {
        console.log(e)
        return res.send({
            type:'error',
            message:'伺服器錯誤，請洽客服人員協助。'
        });
    }
});

// 獲取特定儀器資料 -- ok
router.post('/api/equipmentSetting/admin/getSpecificData', authMiddleware(10), async (req, res) => {

    const { targetEquipment } = req.body;

    try {

        const equipment = await equipmentModel.findOne({ token: targetEquipment, isDeleted: false });
        if(!equipment){
            return res.send({
                type:'error',
                data: {},
                message:'儀器資料不存在。'
            });
        }

        return res.send({
            type:'success',
            data: equipment,
            message:'儀器資料獲取成功！'
        });
        
    } catch (e) {
        console.log(e)
        return res.send({
            type:'error',
            message:'伺服器錯誤，請洽客服人員協助。'
        });
    }
});

// 新增儀器 -- ok
router.post('/api/equipmentSetting/admin/register', authMiddleware(10), async (req, res) => {

    const token =  uuidv4();
    let { name } = req.body;

    if (!name) {
        return res.send({
            type:'error',
            message:'註冊資料不可為空。'
        });
    }

    try {

        const existingEquipment = await equipmentModel.findOne({ name, isDeleted: false });
        if (existingEquipment) {
            return res.send({
                type:'error',
                message:'儀器已存在，請選擇其他儀器名稱。'
            });
        }
        
        const newEquipment = new equipmentModel({
            createTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            token,
            name
        });

        await newEquipment.save();

        return res.send({
            type:'success',
            message:'儀器註冊成功。' 
        });

    } catch (e) {
        console.log(e)
        return res.send({
            type:'error',
            message:'伺服器錯誤，請洽客服人員協助。'
        });
    }
});

// 修改儀器資訊 -- 尚未檢查預約系統
router.post('/api/equipmentSetting/admin/revise', authMiddleware(10), async (req, res) => {

    let { targetEquipment, name, rate, superUser, users } = req.body;

    if (!name || !Number.isInteger(rate)) {
        return res.send({ type:'error',  message:'修改資料不可為空。'});
    }

    try {

        // 檢查是否與其他儀器重名
        const existingEquipment = await equipmentModel.findOne({ name, isDeleted: false });
        if (existingEquipment && existingEquipment.token != targetEquipment) {
            return res.send({ type:'error', message:'儀器已存在，請選擇其他儀器名稱。'});
        }

        const equipment = await equipmentModel.findOne({ token: targetEquipment, isDeleted: false });
        if(!equipment){
            return res.send({ type:'error', message:'儀器資料不存在。'});
        }

        equipment.name = name;
        equipment.rate = rate;
        equipment.superUser = superUser;
        equipment.users = users;

        // 從 equipment.reservation 中的未來預約紀錄中刪除不在 users 名單中的預約項目
        const today = new Date().toLocaleDateString('sv-SE');
        equipment.reservation = equipment.reservation.filter((item) => {
            if (item.reserve_date <= today) return true;
            return users.includes(item.user);
        });

        await equipment.save();

        return res.send({
            type:'success',
            message:'儀器資料修改成功。' 
        });

    } catch (e) {
        console.log(e)
        return res.send({
            type:'error',
            message:'伺服器錯誤，請洽客服人員協助。'
        });
    }
});

// 停用儀器 -- 尚未檢查預約系統
router.put('/api/equipmentSetting/admin/freeze', authMiddleware(10), async (req, res) => {

    let { targetEquipment } = req.body;

    if (!targetEquipment) {
        return res.send({
            type:'error', message:'儀器停用失敗（資料為空）。'
        });
    }

    try {

        const existingEquipment = await equipmentModel.findOne({ token: targetEquipment, isDeleted: false });
        if (!existingEquipment) {
            return res.send({
                type:'error', message:'儀器停用失敗（儀器不存在）。'
            });
        }

        existingEquipment.status = false;

        // 移除所有未來的預約資訊
        const today = new Date().toLocaleDateString('sv-SE');
        existingEquipment.reservation = existingEquipment.reservation.filter((item) => {
            return item.reserve_date < today;
        });
        
        await existingEquipment.save();
        

        return res.send({
            type:'success', message:'儀器停用成功。' 
        });

    } catch (e) {
        console.log(e)
        return res.send({
            type:'error', message:'伺服器錯誤，請洽客服人員協助。'
        });
    }
});

// 重啟儀器 -- 尚未檢查預約系統
router.put('/api/equipmentSetting/admin/restart', authMiddleware(10), async (req, res) => {

    let { targetEquipment } = req.body;

    if (!targetEquipment) {
        return res.send({
            type:'error', message:'儀器重啟失敗（資料為空）。'
        });
    }

    try {

        const existingEquipment = await equipmentModel.findOne({ token: targetEquipment, isDeleted: false });
        if (!existingEquipment) {
            return res.send({
                type:'error', message:'儀器重啟失敗（儀器不存在）。'
            });
        }

        existingEquipment.status = true;     
        await existingEquipment.save();
        

        return res.send({
            type:'success', message:'儀器重啟成功。' 
        });

    } catch (e) {
        console.log(e)
        return res.send({
            type:'error', message:'伺服器錯誤，請洽客服人員協助。'
        });
    }
});

// 刪除儀器 -- 尚未檢查預約系統
router.post('/api/equipmentSetting/admin/delete', authMiddleware(10), async (req, res) => {

    let { targetEquipment } = req.body;

    if (!targetEquipment) {
        return res.send({
            type:'error', message:'儀器刪除失敗（資料為空）。'
        });
    }

    try {

        const deletedEquipment = await equipmentModel.findOne({ token: targetEquipment, isDeleted: false });

        if (!deletedEquipment) {
            return res.send({ type: 'error', message: '儀器刪除失敗（儀器不存在）。'});
        }

        deletedEquipment.isDeleted = true;

        // 移除所有未來的預約資訊
        const today = new Date().toLocaleDateString('sv-SE');
        deletedEquipment.reservation = deletedEquipment.reservation.filter((item) => {
            return item.reserve_date < today;
        });

        await deletedEquipment.save();

        return res.send({
            type:'success', message:'儀器刪除成功。' 
        });

    } catch (e) {
        console.log(e)
        return res.send({
            type:'error', message:'伺服器錯誤，請洽客服人員協助。'
        });
    }
});

// 獲取 User 選項
router.get('/api/equipmentSetting/admin/getUserList', authMiddleware(10), async (req, res) => {

    try {
        const users = await userModel.find({})
        const output = users.map((user) =>{
            return {
                key: user.token,
                value: user.token,
                label: user.name,
            }
        })

        return res.send({
            type:'success',
            data: output,
            message:'人員列表獲取成功！'
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