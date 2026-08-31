// for /reservation-record

// 全頁驗證機制
const express = require('express');
const router = express.Router();


const equipmentModel = require('../../../models/equipmentModel');
const authMiddleware = require('../../../middleware/auth.middleware');


// 獲取使用者個人的所有預約記錄 （以最新的排在最上面）
router.get('/api/reservationRecord/user/getData', authMiddleware(0), async (req, res) => {

    try {

        const equipments = await equipmentModel.find({ 'reservation.user': req.user.token }).lean();

        const output = [];

        equipments.forEach((equipment) => {

            equipment.reservation.forEach((reservation) => {

                if (reservation.user !== req.user.token) return;

                output.push({
                    equipment: equipment.name,
                    reserveId: reservation.reserveId,
                    reserve_date: reservation.reserve_date,
                    reserve_period: reservation.reserve_period,
                });

            });

        });

        // 依照預約日期 + 時段，由新到舊排序
        output.sort((a, b) => {

            const dateTimeA = new Date(`${a.reserve_date}T${a.reserve_period}:00`).getTime();
            const dateTimeB = new Date(`${b.reserve_date}T${b.reserve_period}:00`).getTime();

            return dateTimeB - dateTimeA;
        });

        return res.send({
            type:'success',
            data: output,
            message:'預約紀錄獲取成功！'
        });

    } catch (e) {
        console.log(e);

        return res.send({
            type:'error',
            data: [],
            message:'伺服器錯誤，請洽客服人員協助。'
        });
    }

});

// 取消預約 （直接根據 reserveId 還有檢查是否為自己的預約記錄）
router.post('/api/reservationRecord/user/cancel', authMiddleware(0), async (req, res) => {

    const { reserveId } = req.body;

    if (!reserveId) {
        return res.send({ type:'error', message:'取消預約失敗（資料為空）。'});
    }

    try {

        // 找出包含該預約的儀器
        const equipment = await equipmentModel.findOne({ 'reservation.reserveId': reserveId });

        if (!equipment) {
            return res.send({ type:'error', message:'取消預約失敗（預約資料不存在）。' });
        }

        // 找出指定預約
        const reservation = equipment.reservation.find((item) => {
            return item.reserveId === reserveId;
        });

        if (!reservation) {
            return res.send({
                type:'error',
                message:'取消預約失敗（預約資料不存在）。'
            });
        }

        // 確認是否為本人預約
        if (reservation.user != req.user.token) {
            return res.send({
                type:'error',
                message:'取消預約失敗（無法取消其他使用者的預約）。'
            });
        }

        // 已簽到不可取消
        if (reservation.status == 2) {
            return res.send({
                type:'error',
                message:'取消預約失敗（該預約已簽到）。'
            });
        }

        // 計算預約開始時間
        const reserveDateTime = new Date(`${reservation.reserve_date}T${reservation.reserve_period}:00`);

        const now = new Date();

        // 預約開始前至少一小時才可以取消
        const cancelDeadline = new Date(reserveDateTime.getTime() - 60 * 60 * 1000);

        if (now >= cancelDeadline) {
            return res.send({
                type:'error',
                message:'取消預約失敗（預約開始前一小時內無法取消）。'
            });
        }

        // 移除預約
        equipment.reservation = equipment.reservation.filter((item) => {
            return item.reserveId !== reserveId;
        });

        await equipment.save();

        return res.send({
            type:'success',
            message:'預約取消成功。'
        });

    } catch (e) {
        console.log(e);

        return res.send({
            type:'error',
            message:'伺服器錯誤，請洽客服人員協助。'
        });
    }

});




module.exports = router;