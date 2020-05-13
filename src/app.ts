// 套件
import Express from 'express';
import CreateError from 'http-errors';
import CookieParser from 'cookie-parser';
import Session from 'express-session';
import ConnectMongo from 'connect-mongo';
import Logger from 'morgan';
import Path from 'path';
import Mongoose from 'mongoose';
import Fs from 'fs';
// import Rfs from 'rotating-file-stream';
const Rfs = require('rotating-file-stream');
import Passport from 'passport';

// 模組
import * as config from './config';
import apiRouter_v1 from './api/v1';
// import authGuard from './package/passport';

// 型別
import globalTypings from './global';

const app = Express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

var accessLogStream = Rfs.createStream(
  'access.log',
  {
    path: Path.join(__dirname, 'log'),
    interval: '1d'
  }
);

app.use(Logger('common', {
  stream: accessLogStream,
  // skip: () => config.ENVIRONMENT === 'dev',
}));

app.use(Express.json()); // application/json
app.use(Express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(CookieParser());

const MongoStore = ConnectMongo(Session);
app.use(Session({
  secret: config.SESSION_SECRET,
  resave: Boolean(config.SESSION_RESAVE),
  saveUninitialized: Boolean(config.SESSION_SAVE_UNINITIALIZED),
  store: new MongoStore({
    mongooseConnection: Mongoose.connection
  })
}));
app.use(Passport.initialize());
app.use(Passport.session());
// app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use('/', Express.static(Path.join(__dirname, 'public')));
app.use('/api/v1', apiRouter_v1);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(CreateError(404));
});

// error handler
app.use(function (err, req, res, next) {
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
    });
});

export default app;
