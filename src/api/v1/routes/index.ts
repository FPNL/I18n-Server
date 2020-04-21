import express from 'express';
import User from './user';
import Lang from './language';
const Router_v1 = express.Router();

/* GET home page. */
Router_v1.use('/user', User);
// TODO 這層的 router 全都要有 權限
// < 製作權限檢查的 middleware
Router_v1.use('/language', Lang);

export default Router_v1;
