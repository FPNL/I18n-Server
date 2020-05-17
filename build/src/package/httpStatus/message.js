"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = __importDefault(require("./code"));
exports.default = new Map([
    [code_1.default.OK, '成功'],
    [code_1.default.NO_DATA, '沒有資料'],
    [code_1.default.INVALID_PARAMS, '參數錯誤'],
    [code_1.default.UNAUTHORIZED, '未通過認證，請先登入'],
    [code_1.default.FORBIDDEN, '你登入了，但不夠格使用'],
    [code_1.default.INTERNAL_SERVER_ERROR, '伺服器錯誤'],
    [code_1.default.ERROR_NOT_EXIST_USER, '使用者不存在'],
    [code_1.default.ERROR_ALREADY_EXIST_USER, '使用者已存在'],
    [code_1.default.ERROR_PASSWORD, '密碼錯誤'],
    [code_1.default.ERROR_ALREADY_EXIST_WORD, '文字重複'],
    [code_1.default.ERROR_NOT_EXIST_WORD, '文字不存在'],
    [code_1.default.ERROR_LANG_COLUMN_OVERFLOW, '語言欄不符合'],
    [code_1.default.ERROR_ALREADY_EXIST_LANGUAGE, '語言已經建構過了'],
    [code_1.default.ERROR_NOT_EXIST_LANGUAGE, '語言並未建構過'],
    [code_1.default.ERROR_DATA_FORMAT, 'data 格式錯誤'],
    [code_1.default.ERROR_NAME_FORMAT, 'name 格式錯誤'],
    [code_1.default.ERROR_CONTENT_FORMAT, 'content 格式錯誤'],
    [code_1.default.ERROR_NICKNAME_FORMAT, 'nickname 格式錯誤'],
    [code_1.default.ERROR_ACCOUNT_FORMAT, 'account 格式錯誤'],
    [code_1.default.ERROR_PASSWORD_FORMAT, 'password 格式錯誤'],
    [code_1.default.ERROR_LANG_COLUMN_FORMAT, 'lang 格式錯誤'],
    [code_1.default.WARNING_REPEAT_WORD, '警告 name 有重複情況'],
    [code_1.default.WARNING_NOT_EXIST_KEY, 'key 尚未創建'],
    [code_1.default.WARNING_NO_CONTENT, '並未填充內容'],
    [code_1.default.ERROR_NOT_EXIST_NATIVE_LANG, '母語尚未設定'],
    [code_1.default.WARNING_LANG_AT_LEAST_ONE, '至少要有 1 個語言']
]);
