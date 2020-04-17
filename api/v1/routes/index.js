const express = require('express');
const router = express.Router();

/* GET home page. */
router.use('/user', require('./user'));
router.use('/language', require('./language'));

module.exports = router;
