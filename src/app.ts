// 套件
import Express = require('express');
import CreateError = require('http-errors');
import CookieParser  = require( 'cookie-parser');
import Session = require('express-session');
const MongoStore = require('connect-mongo')(Session);
import Logger  = require( 'morgan');
import Path = require('path');
// 模組
import apiRouter from './api/v1';
import database from './database';
import config from './config';
import authGuard from './package/authGuard';
import globalTypings from './typings';

const app = Express();

database.sequelize.sequelizeConnectionTest()
database.mongoose.mongooseConnectionTest();
database.redis.redisConnectionTest();
// Database.mongo.run().catch(console.dir);

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// const fs = require('fs');
// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
// app.use(Logger('short', {stream: accessLogStream}));

app.use(Logger('dev'));
app.use(Express.json()); // application/json
app.use(Express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(CookieParser());

app.use(Session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: database.mongoose.Mongoose.connection
  })
}));
app.use(authGuard.Passport.initialize());
app.use(authGuard.Passport.session());
// app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use('/', Express.static(Path.join(__dirname, 'public')));
app.use('/api', apiRouter);

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
