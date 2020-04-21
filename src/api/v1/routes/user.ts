import Express from 'express';

// import { userController } from '../controller';
import Controller from '../controller';
import Util from '../util';

const router = Express.Router();

router.post('/login', async (req, res, next) => {
  const responseData = await Controller.User.loginHandler(req);
  Util.routerResponseFormatter(res, responseData);
});

router.post('/register', async (req, res, next) => {
  const responseData = await Controller.User.registerHandler(req);
  Util.routerResponseFormatter(res, responseData);
})

export default router;
