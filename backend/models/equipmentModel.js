const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    createTime:String,
    token: {
        type: String,
        required:true,
        unique: true,
        trim: true,
    },
    isDeleted:{ // 是否已被刪除 -- 保留紀錄用
        type: Boolean,
        default: false,
    },
    name:{
        type: String,
        trim: true,
        default: '',
    },
    status:{ // 可否使用
        type: Boolean,
        default: true,
    },
    rate:{ // 費率/hr
        type: Number,
        default: 0,
    },
    superUser:{ // superUser token
        type: String,
        trim: true,
        default: ''
    },
    users:{ // users token
        type: [String],
        default: [],
    },
    reservation:{
        type: [
            {
                token:{ // 預約序號
                    type: String,
                    trim: true,
                },
                user:{ // 使用者 token
                    type: String,
                    trim: true,
                },
                reserve_date:{
                    type: String,
                    trim: true,
                },
                reserve_period:{
                    type: String,
                    trim: true,
                },
                status:{ // 0. 禁用選項 1. 可預約 2. 已預約 3. 已簽到
                    type: Number,
                    default: 1
                }
            }
        ],
        default:[]
    }
});


const equipmentModel = mongoose.model('Equipment', equipmentSchema);

module.exports = equipmentModel;
