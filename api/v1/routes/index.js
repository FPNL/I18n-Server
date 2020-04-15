const express = require('express');
const router = express.Router();

/* GET home page. */
router.use('/user', require('./user'))

module.exports = router;
