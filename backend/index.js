const express = require('express');
const compression = require('compression');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.set('trust proxy', 'loopback, 192.168.0.1'); 


const rateLimit = require('express-rate-limit');

// 不受限速
const whitelistRoutes = [
    '/api/img',
];

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 分鐘
    max: 200,
    message: 'Too many requests from this account, please try again after a minute.',
    keyGenerator: (req, res) => {
        return req.headers['x-user-token'];
    },
    skip: (req, res) => {
        return whitelistRoutes.some(route => req.path.startsWith(route));
    },
    handler: (req, res, next, options) => {
        return res.redirect('/');
    }
});

app.use(limiter);

app.use((req, res, next) => {
  next();
});


// 初始化資料庫
const { connectToDatabase, disconnectFromDatabase } = require('./db/db');
connectToDatabase();

const loginRouter = require('./routes/loginRouter');
app.use(loginRouter);



// by Admin
const memberSettingByAdminRouter = require('./routes/byAdmin/settingRoutes/memberSettingRouter');
app.use(memberSettingByAdminRouter);

const labSettingByAdminRouter = require('./routes/byAdmin/settingRoutes/labSettingRouter');
app.use(labSettingByAdminRouter);

// by User
const memberSettingByUserRouter = require('./routes/byUser/settingRoutes/memberSettingRouter');
app.use(memberSettingByUserRouter);

app.listen(3007,()=>{
    console.log('server is running on port 3007')
})

process.on('SIGINT', function() {
    disconnectFromDatabase();
    process.exit(0);
});

// 避免系統中斷
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});