const { HttpStatus } = require('../../../package/e');
const { language: LangService } = require('../service');

async function createWordsHandler(req) {
    //  確認是否有符合語言名單 -> validation -> checkExist -> insertModel -> response_OK
    try {
        // 只驗證 name 全英文分大小寫+數字
        if(!await LangService.wordValidation(req)) {
            return { status: HttpStatus.INVALID_PARAMS, result: false}
        }

        const reqData = req.body;

        // 確認是否有符合語言名單 若是 input { name, en, cht } 可是lang list 只有 { name, en }，
        // 是不是代表客端錯誤或是增加語言欄位的功能發生錯誤？
        if (!await LangService.checkLanguageColumnIncludeReqData(reqData)) {
            return {status: HttpStatus.INVALID_PARAMS, result: false}
        }

        // 確認重複
        if (await LangService.checkWordExist(reqData)) {
            return { status: HttpStatus.ERROR_ALREADY_EXIST_WORD, result: false}
        }

        // 插入單一字詞
        await LangService.insertWordIntoDB(reqData);

    } catch (e) {
        console.error("createWordsHandler 錯誤", e);
        return { status: HttpStatus.INTERNAL_SERVER_ERROR, result: false }
    }
    return { status: HttpStatus.OK, result: true };
}


module.exports = { createWordsHandler };
