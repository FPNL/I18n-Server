// 套件
import CreateError = require('http-errors');
import Express = require('express');
import CookieParser  = require( 'cookie-parser');
import Logger  = require( 'morgan');
import Path  = require( 'path');
// 模組
import ApiRouter from './api/v1';
import Database from './database';

const app = Express();

Database.sequelize.sequelizeConnectionTest()
Database.mongoose.mongooseConnectionTest();
Database.redis.redisConnectionTest();
// Database.mongo.run().catch(console.dir);

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// const fs = require('fs');
// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
// app.use(logger('short', {stream: accessLogStream}));

app.use(Logger('dev'));
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
app.use(CookieParser());

// app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use('/', Express.static(Path.join(__dirname, 'public')));
app.use('/api', ApiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(CreateError(404));
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

export default app;
