import Express from 'express';

import { routerResponseFormatter } from '../util';
import { HttpStatus } from '../../../package/httpStatus';

function isAuthByPassport(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  const responseData = { status: HttpStatus.UNAUTHORIZED, result: false };
  routerResponseFormatter(res, responseData);
}

export { isAuthByPassport };
