import Express from 'express';

import { routerResponseFormatter } from '../util';
import { HttpStatus } from '../../../package/httpStatus';
import { userPath } from '../routes/user';
import { langPath } from '../routes/language';

function isAuthByPassport(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  const responseData = { status: HttpStatus.UNAUTHORIZED, result: false };
  routerResponseFormatter(res, responseData);
}

/**
 * 從 router 制作下表
 * true：即使是訪客也可以。
 * false：全部的角色，不包含訪客
 * ['character']： 特定角色
 * null： 任何人都不行
 * true/false 選定解釋： 預定true 和 false 都包含全部的意思，差別在 有無包含訪客，而我們假定訪客是 一個人，
 * 也就是 1， * 在 JS， 1 == true, 0 == false ， 所以就這樣定了。
 * 那怎不寫 'all'呢？ 的確可以，但是怕寫錯字、儲存空間比 false 大、這個名詞會被修改...等
 * 所以採用了保留字。
 *
 *  */
const apiV1 = {
  "/api/v1/user": new Map([
    [userPath.Login, true],
    [userPath.Register, true],
  ]),
  "/api/v1/language": new Map([
    [langPath.LangList, ['admin', 'manager', 'adviser']],
    [langPath.LangAdd, ['admin', 'manager']],
    [langPath.LangDelete, ['admin', 'manager']],
    [langPath.WordsContent, ['admin', 'manager', 'adviser']],
    [langPath.WordsAdd, ['admin', 'manager']],
    [langPath.WordsAlter, ['admin', 'manager']],
    [langPath.WordsDelete, ['admin', 'manager']],
    [langPath.NativeLangGet, ['admin', 'manager', 'adviser']],
    [langPath.NativeLangUpdate, ['admin', 'manager']],
  ])
};
// apiV1[req.baseURl][req.url]
// apiV1['/api/v1/user']['/login'];
type accessType = ['admin', 'manager', 'adviser'] | false | true | null;
function isAuthorization(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
  const { baseUrl, url, user } = req;
  const access: accessType = apiV1[baseUrl].get(url);
  if (access === true) {
    next();
  } else if (!user) {
    const responseData = { status: HttpStatus.UNAUTHORIZED, result: false };
    routerResponseFormatter(res, responseData);
  } else if (access === null) {
    const responseData = { status: HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    routerResponseFormatter(res, responseData);
  } else if (access === false || access.includes(((user as { character: any; }).character))) {
    next();
  } else {
    const responseData = { status: HttpStatus.FORBIDDEN, result: false };
    routerResponseFormatter(res, responseData);
  }
}

export { isAuthByPassport, isAuthorization };
