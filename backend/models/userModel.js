const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    createTime:String,
    // 私人特徵碼（uuid）
    token: {
        type: String,
        required:true,
        unique: true,
        trim: true,
    },
    status:{
        type: Boolean,
        default: true,
    },
    level:{
        type: Number,
        required:true,
    },
    account:{
        type:String,
        required:true,
        unique: true,
        trim: true,
    },
    password:{
        type:String,
        required:true,
        trim: true,
    },
    name:{
        type: String,
        trim: true,
        default: 'User',
    },
    userImgUrl: {
        url: { 
            type: String, 
            trim: true, 
            default: 'img/user.png' 
        },
        original: { 
            type: String, 
            trim: true, 
            default: '' 
        }
    },
    lastOnline:{
        type:String,
        default:''
    },
    historyRecord:{
        type: Array,
        default: []
    },
    detail:{
        phoneNumber:{
            type:String,
            default:''
        },
        mailAddress:{
            type:String,
            default:''
        },
        idCard:{
            type:String,
            default:''
        }
    }
});


const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
