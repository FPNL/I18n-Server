// Package
import Express from 'express';
// Module
import * as userController from '../controller/user';
import { routerResponseFormatter } from '../util';

const router = Express.Router();

router.post('/login',
  userController.customPassportAuth,
  async (req, res, next) => {
    // req.responseData 是 controller 賦予的
    const { responseData } = req;
    if (!responseData) {
      next(new Error('內部嚴重錯誤'));
    }
    routerResponseFormatter(res, responseData);
  }
);

router.post('/register', async (req, res, next) => {
  const responseData = await userController.registerHandler(req);
  routerResponseFormatter(res, responseData);
});

export default router;
