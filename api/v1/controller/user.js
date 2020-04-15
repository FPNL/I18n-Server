// 改變 回傳結果

const HttpStatus = require('http-status-codes');
const {user: UserService} = require('../service');

async function login(reqData) {
    // 驗證 -> 符合格式 -> 確認資料庫有無資料 -> 成功則發送 cookie 或 socket 保持連線
    // 預設最終結果都正確 result true, status 200
    // 有錯誤則 result false, status 看狀況

    // let invalidResponse = { result: false, status: HttpStatus.BAD_REQUEST };

    // TODO 高 資料驗證
    // if(!LoginValidation(reqData)) {
    //   return invalidResponse;
    // }

    // TODO 中 資料格式化
    // reqData = TransformData(reqData) for Database search 例如 密碼需要雜湊

    // TODO 高 確認資料存在否
    let { result, status } = await UserService.checkUserExist(reqData);
    if(status !== HttpStatus.OK) {
      return { result: false, status };
    }

    // TODO 低 紀錄 cookie 保持登入
    // if( !CookieRecord(?result) ) {
    //     return { result: false, status: HttpStatus.INTERNAL_SERVER_ERROR };
    // }

    // TODO 低 websocket 連線
    // WebSocket()

    return { result: true, status: HttpStatus.OK }
}

async function register(data) {
    // return getDataFromModel(UserModel.createUser, data);
    return {result: true, status: 200};
}

module.exports = { login, register }