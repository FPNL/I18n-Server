const express = require('express');
const v1 = express();

v1.use('/v1', require('./routes'));

module.exports = v1;