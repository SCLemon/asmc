// 門禁控制
// for /door-access-control

// 全頁驗證機制
const express = require('express');
const router = express.Router();

const userModel = require('../../../models/userModel');

const authMiddleware = require('../../../middleware/auth.middleware');

const { addUser, deleteUser, getUserList, getEventLog } = require('../../../utils/soyal');


// 獲取特定門禁的使用者名單
router.post('/api/door-access-control/admin/getUserList', authMiddleware(10), async (req, res) => {

    const { systemId, page } = req.body;

    if (!systemId || !page) {
        return res.send({ type: 'error', data: [], message: '門禁查詢參數不可為空。' });
    }

    try{
        return res.send(await getUserList(systemId, (page - 1) * 30));
    }
    catch(e){
        console.log(e)
        return res.send({
            type:'error',
            message:'伺服器錯誤，請洽客服人員協助。'
        });
    }

});

router.post('/api/door-access-control/admin/getEventLog', authMiddleware(10), async (req, res) => {

    const { systemId, page } = req.body;

    if (!systemId || !page) {
        return res.send({ type: 'error', data: [], message: '門禁查詢參數不可為空。' });
    }

    try{
        return res.send(await getEventLog(systemId, page))
    }
    catch(e){
        console.log(e)
        return res.send({
            type:'error',
            message:'伺服器錯誤，請洽客服人員協助。'
        });
    }

});

// 新增或修改使用者資料
router.post('/api/door-access-control/admin/addUser', authMiddleware(10), async (req, res) => {

    const { targetUser, systemId, uAddr } = req.body;

    if (!targetUser || !systemId || !uAddr) {
        return res.send({ type: 'error', message: '門禁用戶參數不可為空。' });
    }

    const user = await userModel.findOne({ token: targetUser });
    const idCard = user.idCard;

    const [ uid1, uid2 ] = [idCard.slice(0, 5), idCard.slice(5, 10)];
    if (uid1.length === 5 && uid2.length === 5) return res.send({ type: 'error', message: '用戶 ID_Card 資料錯誤。' });

    try{
        return res.send(await addUser(systemId, uAddr, uid1, uid2))
    }
    catch(e){
        console.log(e)
        return res.send({
            type:'error',
            message:'伺服器錯誤，請洽客服人員協助。'
        });
    }

});

// 刪除使用者資料
router.post('/api/door-access-control/admin/deleteUser', authMiddleware(10), async (req, res) => {

    const { systemId, uAddr } = req.body;

    if (!systemId || !uAddr) {
        return res.send({ type: 'error', message: '門禁用戶參數不可為空。' });
    }
    try{
        return res.send(await deleteUser(systemId, uAddr))
    }
    catch(e){
        console.log(e)
        return res.send({
            type:'error',
            message:'伺服器錯誤，請洽客服人員協助。'
        });
    }

});




module.exports = router;
