// 套件
import Express from 'express';
import CreateError from 'http-errors';
import CookieParser from 'cookie-parser';
import Path from 'path';
import helmet from 'helmet';
// import Fs from 'fs';

// 模組
import apiRouter_v1 from './api/v1';
import Passport from './package/passport';
import { mongoSession } from './package/session';
// import { iPLimit } from './package/ipLimit';
import { logger } from './package/logger';
// import * as config from './config';
// 型別
import globalTypings from './global';

const app = Express();

// app.use(iPLimit);
app.use(logger);
app.use(mongoSession);
app.use(helmet());

app.use(Express.json()); // application/json
app.use(Express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(CookieParser());

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
  const resJson = process.env.NODE_ENV === 'production'
    ? {
      message: err.message,
    }
    : {
      message: err.message,
      stack: err.stack
    };

  res
    .status(err.status || 500)
    .json(resJson);
});

export default app;
