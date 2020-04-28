import Express = require('express');

import controller from '../controller';
import util from '../util';

const router = Express.Router();

router.post('/login',
  controller.User.customPassportAuth,
  async (req, res, next) => {
    const { responseData } = req;
    if (!responseData) {
      next(new Error('內部嚴重錯誤'));
    }
    util.routerResponseFormatter(res, responseData);
  }
);

router.post('/register', async (req, res, next) => {
  const responseData = await controller.User.registerHandler(req);
  util.routerResponseFormatter(res, responseData);
})

export default router;
