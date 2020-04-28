import Express = require('express');

import util from '../util';
import ErrorPackage from '../../../package/e';

export function isAuthByPassport(req:Express.Request, res: Express.Response, next: Express.NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  const responseData= { status: ErrorPackage.HttpStatus.UNAUTHORIZED, result: false };
  util.routerResponseFormatter(res, responseData);
}
