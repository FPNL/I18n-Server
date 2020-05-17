// Package
import Express from 'express';
// Module
import * as authController from '../controller/auth';
import { routerResponseFormatter } from '../util';
import { HttpStatus } from '../../../package/httpStatus';

const router = Express.Router();

router.get('/character', async (req, res, next): Promise<void> => {

  let responseData = { status: 200, result: { character: 'hi' } };

  routerResponseFormatter(res, responseData);
});

export default router;
