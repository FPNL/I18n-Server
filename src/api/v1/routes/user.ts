// Package
import Express from 'express';
// Module
import * as userController from '../controller/user';
import { routerResponseFormatter } from '../util';

const router = Express.Router();

export const userPath = {
  Login: '/login',
  Register: '/register'
};

router.post(userPath.Login,
  userController.customPassportAuth,
  async (req, res, next) => {
    // console.log(233, req.baseUrl, req.originalUrl, req.route, req.url);

    // req.responseData 是 controller 賦予的
    const { responseData } = req;
    if (!responseData) {
      next(new Error('內部嚴重錯誤'));
    }
    routerResponseFormatter(res, responseData);
  }
);

router.post(userPath.Register, async (req, res, next) => {
  const responseData = await userController.registerHandler(req);
  routerResponseFormatter(res, responseData);
});

export default router;
