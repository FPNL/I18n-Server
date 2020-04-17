const code = require('./code');

module.exports = new Map([
    [code.OK, '成功'],
    [code.INVALID_PARAMS, '參數錯誤'],
    [code.INTERNAL_SERVER_ERROR, '伺服器錯誤'],

    [code.ERROR_NOT_EXIST_USER, '使用者不存在'],
    [code.ERROR_ALREADY_EXIST_USER, '使用者已存在'],

    [code.ERROR_ALREADY_EXIST_WORD, '文字重複']
]);
