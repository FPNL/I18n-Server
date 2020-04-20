const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const stylus = require('stylus');
require('dotenv').config({ path: './config/.env' });
const database = require('./repository');

const app = express();

database.sequelize.sequelizeConnectionTest()
database.mongoose.mongooseConnectionTest();
// database.mongo.run().catch(console.dir);

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// const fs = require('fs');
// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
// app.use(logger('short', {stream: accessLogStream}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/api', require('./api/v1'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // 可看到 views/error 裡頭自帶參數 error ，從這段 code 可推斷 res.locals 是提供給樣板的變數
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  // res.render('error');

  res
    .status(err.status || 500)
    .json({
      message: err.message,
      stack: err.stack
    })
});

module.exports = app;
