// Package
import Express from 'express';
import Passport from 'passport';
// Module
import { HttpStatus } from '../../../package/httpStatus';
import * as userService from '../service/user';
// Typing
import { ModelDeclare } from '../repository/model';

function customPassportAuthHandler(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    Passport.authenticate('local', function (_err, user, _info) {
        if (!user) { return next(); }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return next();
        });
    })(req, res, next);
}


async function loginHandler(req: Express.Request): Promise<[boolean, { id: string; account: string; } | null]> {
    // 驗證 -> 符合格式 -> 取得資料順便確認存在 -> 確認密碼 -> 成功則發送 cookie 或 socket 保持連線
    // 預設最終結果都正確 result true, status 200
    // res.responseData = { result: false, status: validationResult };
    // 之所以會在 req 給 responseData 而不是 res 新增的原因是因為 Passport 套件只有提供 req 參數
    // src/package/authGuard/index.ts Strategy 策略的 callback function 未提供 res
    // let invalidResponse = { result: false, status: HttpStatus.BAD_REQUEST };
    const isError = true;
    try {
        const reqData = <{ account: string; password: string; }>req.body;
        // 資料驗證： 帳號需是 email, 密碼只能 0-1, a-Z
        const [validationError, validationResult] = await userService.loginValidation(req);
        if (validationError) {
            req.responseData = { result: false, status: validationResult };
            return [isError, null];
        }

        // 確認資料存在
        const [fetchError, userOrHttpStatus] = await userService.fetchUserData(reqData);
        if (fetchError) {
            req.responseData = { result: false, status: <number>userOrHttpStatus };
            return [isError, null];
        }

        // 確認密碼
        const [hashError, compareResult] = userService.compareHashPassword(reqData, (userOrHttpStatus as ModelDeclare.UserModel).password);
        if (hashError) {
            req.responseData = { result: false, status: compareResult };
            return [isError, null];
        }

        req.responseData = { result: true, status: HttpStatus.OK };
        return [!isError, (userOrHttpStatus as ModelDeclare.UserModel)];

        // TODO 低 websocket 連線
        // WebSocket()

    } catch (e) {
        console.error("loginHandler 錯誤 ： ", e);
        req.responseData = { result: false, status: HttpStatus.INTERNAL_SERVER_ERROR };
        return [isError, null];
    }
}

async function registerHandler(req) {
    try {
        // 驗證 -> 符合格式 -> 確認資料庫有無資料 -> 資料格式化 密碼需要雜湊 -> 新增資料
        if (!await userService.registerValidation(req)) {
            return { result: false, status: HttpStatus.INVALID_PARAMS };
        }

        const reqBodyData = req.body;

        if (await userService.checkUserExist(reqBodyData)) {
            return { result: false, status: HttpStatus.ERROR_ALREADY_EXIST_USER };
        }

        // 中 資料格式化 密碼需要雜湊
        const [error, hashNumber] = userService.hashPassword(reqBodyData);
        if (error) {
            return { result: false, status: hashNumber };
        }

        if (!await userService.createUserData(reqBodyData)) {
            return { result: false, status: HttpStatus.INTERNAL_SERVER_ERROR };
        }
    } catch (e) {
        console.error("registerHandler 錯誤 ： ", e);
        return { result: false, status: HttpStatus.INTERNAL_SERVER_ERROR };
    }
    return { result: true, status: HttpStatus.OK };
}

export {
    loginHandler,
    registerHandler,
    customPassportAuthHandler,
};
