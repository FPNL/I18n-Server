const { HttpStatus } = require('../../../package/e');
const { language: LangService } = require('../service');

async function createWordHandler(req) {
    //  validation -> 確認是否有符合語言名單 -> checkExist -> insertModel -> response_OK
    try {
        // 只驗證 name 全英文分大小寫+數字
        if(!await LangService.wordValidation(req)) {
            return { status: HttpStatus.ERROR_NAME_FORMAT, result: false}
        }

        const reqBodyData = req.body;

        // 確認是否有符合語言名單 若是 input { name, en, cht } 可是lang list 只有 { name, en }，
        // 是不是代表客端錯誤或是增加語言欄位的功能發生錯誤？
        if (!await LangService.checkWordDataMatchLangColumn(reqBodyData)) {
            return { status: HttpStatus.ERROR_LANG_COLUMN_OVERFLOW, result: false };
        }

        // 確認重複
        if (await LangService.checkWordExist(reqBodyData)) {
            return { status: HttpStatus.ERROR_ALREADY_EXIST_WORD, result: false}
        }

        // 插入單一字詞
        await LangService.insertWordIntoDB(reqBodyData);

    } catch (error) {
        console.error("createWordsHandler 錯誤", error);
        return { status: HttpStatus.INTERNAL_SERVER_ERROR, result: false }
    }
    return { status: HttpStatus.OK, result: true };
}

async function getLanguageListHandler(req) {
    // 給資料
    try {
        const result = await LangService.getLangList();
        if (result) {
            return { status: HttpStatus.OK, result };
        }

    } catch (error) {
        return { status: HttpStatus.INTERNAL_SERVER_ERROR, result: false}
    }
    return { status: HttpStatus.NO_DATA, result: false };
}

async function readWordContentHandler(req) {
    // router 有權限檢查的 middleware (製作中) -> 給資料
    try {
        const reqParam = req.params;
        const result = await LangService.getLimitWordsData(reqParam);
        if (result) {
            return { status: HttpStatus.OK, result };
        }

    } catch (error) {
        console.error("createWordsHandler 錯誤", error);
        return { status: HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    }
    return { status: HttpStatus.NO_DATA, result: false };
}

async function addLanguageHandler(req) {
    // 檢查格式 -> 檢查重複欄位 -> 插入新欄位 -> 更新 redis 語言列表
    try {
        // 限定在 'a-Z', '-'
        if (! await LangService.checkLangColumnValidation(req) ) {
            return { status: HttpStatus.ERROR_LANG_COLUMN_FORMAT, result: false };
        }

        const reqBodyData = req.body;

        if (await LangService.checkLangColumnRepeat(reqBodyData) ) {
            return { status: HttpStatus.ERROR_ALREADY_EXIST_LANGUAGE, result: false}
        }

        await LangService.addOneLangColumnToDB(reqBodyData);

    } catch (error) {
        console.error("addLanguageHandler 錯誤", error);
        return { status: HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    }
    return { status: HttpStatus.OK, result: true };
}

async function deleteWordHandler(req) {
    // delete multiple data -> validation -> check exist -> delete data
    try {
        // 只驗證 name 全英文分大小寫+數字
        const ab = await LangService.wordValidation(req);
        console.log(233, ab);

        if(!await LangService.wordValidation(req)) {
            return { status: HttpStatus.ERROR_NAME_FORMAT, result: false}
        }

        const reqBodyData  = req.body;

        const a = await LangService.checkWordExist(reqBodyData);
        console.log(344, a);

        if (!await LangService.checkWordExist(reqBodyData)) {
            return { status: HttpStatus.ERROR_NOT_EXIST_WORD, result: false };
        }





    } catch (error) {
        return { status: HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    }
    return { status: HttpStatus.INTERNAL_SERVER_ERROR, result: false };
}

module.exports = {
    createWordHandler,
    readWordContentHandler,
    getLanguageListHandler,
    addLanguageHandler,
    deleteWordHandler,
};
