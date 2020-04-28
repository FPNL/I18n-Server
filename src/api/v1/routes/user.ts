import Express = require('express');

import Controller from '../controller';
import Util from '../util';

const router = Express.Router();

router.post('/login',
  Controller.User.customPassportAuth,
  async (req, res, next) => {
    const { responseData } = req;
    if (!responseData) {
      next(new Error('內部嚴重錯誤'));
    }
    Util.routerResponseFormatter(res, responseData);
  }
);

router.post('/register', async (req, res, next) => {
  const responseData = await Controller.User.registerHandler(req);
  Util.routerResponseFormatter(res, responseData);
})

export default router;
