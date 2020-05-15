import code from './code';

export default new Map([
    [code.OK, '成功'],
    [code.NO_DATA, '沒有資料'],
    [code.INVALID_PARAMS, '參數錯誤'],
    [code.UNAUTHORIZED, '未通過認證，請先登入'],
    [code.FORBIDDEN, '你登入了，但不夠格使用'],
    [code.INTERNAL_SERVER_ERROR, '伺服器錯誤'],

    [code.ERROR_NOT_EXIST_USER, '使用者不存在'],
    [code.ERROR_ALREADY_EXIST_USER, '使用者已存在'],
    [code.ERROR_PASSWORD, '密碼錯誤'],

    [code.ERROR_ALREADY_EXIST_WORD, '文字重複'],
    [code.ERROR_NOT_EXIST_WORD, '文字不存在'],
    [code.ERROR_LANG_COLUMN_OVERFLOW, '語言欄不符合'],
    [code.ERROR_ALREADY_EXIST_LANGUAGE, '語言已經建構過了'],
    [code.ERROR_NOT_EXIST_LANGUAGE, '語言並未建構過'],
    [code.ERROR_DATA_FORMAT, 'data 格式錯誤'],
    [code.ERROR_NAME_FORMAT, 'name 格式錯誤'],
    [code.ERROR_CONTENT_FORMAT, 'content 格式錯誤'],
    [code.ERROR_NICKNAME_FORMAT, 'nickname 格式錯誤'],
    [code.ERROR_ACCOUNT_FORMAT, 'account 格式錯誤'],
    [code.ERROR_PASSWORD_FORMAT, 'password 格式錯誤'],
    [code.ERROR_LANG_COLUMN_FORMAT, 'lang 格式錯誤'],
    [code.WARNING_REPEAT_WORD, '警告 name 有重複情況'],
    [code.WARNING_NOT_EXIST_KEY, 'key 尚未創建'],
    [code.WARNING_NO_CONTENT, '並未填充內容'],
    [code.ERROR_NOT_EXIST_NATIVE_LANG, '母語尚未設定'],
    [code.WARNING_LANG_AT_LEAST_ONE, '至少要有 1 個語言']
]);
