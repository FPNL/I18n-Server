// 改變 回傳結果

const { HttpStatus, HttpStatusMessage } = require('../../../package/e');
const {user: UserService} = require('../service');


async function loginHandler(req) {
    // 驗證 -> 符合格式 -> 確認資料存在 -> 確認密碼 -> 成功則發送 cookie 或 socket 保持連線
    // 預設最終結果都正確 result true, status 200

    // let invalidResponse = { result: false, status: HttpStatus.BAD_REQUEST };
    try {
        // 資料驗證： 帳號需是 email, 密碼只能 0-1, a-Z
        if(!await UserService.loginValidation(req)) {
            return { result: false, status: HttpStatus.INVALID_PARAMS };
        }

        // TODO 中 資料格式化
        // reqData = TransformData(reqData) for Database search 例如 密碼需要雜湊

        const reqData = req.body;

        // 確認資料存在
        if(!await UserService.checkUserExist(reqData)) {
            return { result: false, status: HttpStatus.ERROR_NOT_EXIST_USER };
        }

        // TODO 高 確認密碼
        // UserService.checkUserPassword()

        // TODO 低 紀錄 cookie 保持登入
        // if( !CookieRecord(?result) ) {
        //     return { result: false, status: HttpStatus.INTERNAL_SERVER_ERROR };
        // }

        // TODO 低 websocket 連線
        // WebSocket()

    } catch (e) {
        return {result: false, status: HttpStatus.INTERNAL_SERVER_ERROR };
    }

    return { result: true, status: HttpStatus.OK }
}

async function registerHandler(req) {
    try {
        // 驗證 -> 符合格式 -> 確認資料庫有無資料 -> 新增資料
        if(!await UserService.registerValidation(req)) {
            return {result: false, status: HttpStatus.INVALID_PARAMS};
        }

        const reqData = req.body;

        if(await UserService.checkUserExist(reqData)) {
            return { result: false, status: HttpStatus.ERROR_ALREADY_EXIST_USER };
        }


        // TODO 中 資料格式化
        // reqData = TransformData(reqData) for Database search 例如 密碼需要雜湊

        if (!await UserService.createUserData(reqData)) {
            return {result: false, status: HttpStatus.INTERNAL_SERVER_ERROR };
        }
    } catch (e) {
        return {result: false, status: HttpStatus.INTERNAL_SERVER_ERROR };
    }

    return {result: true, status: HttpStatus.OK};
}

module.exports = { loginHandler, registerHandler }