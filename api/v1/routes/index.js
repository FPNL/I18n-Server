const express = require('express');
const router = express.Router();

/* GET home page. */
router.use('/user', require('./user'));
// TODO 這層的 router 全都要有 權限
// < 製作權限檢查的 middleware
router.use('/language', require('./language'));

module.exports = router;
