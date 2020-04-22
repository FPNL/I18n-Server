import Express = require('express');

import ErrorPackage from '../../../package/e';
import Service from '../service';
import { Controller } from './controller';


async function getLanguageListHandler(req: Express.Request): Promise<Controller.typicalResponse> {
    // router 有權限檢查的 middleware (製作中) -> 給資料.
    try {
        const result = await Service.Lang.getLangList();
        if (result /*&& await Service.Lang.checkResponseLangColumnFormat(result)*/) {
            return { status: ErrorPackage.HttpStatus.OK, result };
        }

    } catch (error) {
        console.error("getLanguageListHandler 錯誤", error);
        return { status: ErrorPackage.HttpStatus.INTERNAL_SERVER_ERROR, result: false}
    }
    return { status: ErrorPackage.HttpStatus.NO_DATA, result: false };
}


async function getWordsContentHandler(req: Express.Request): Promise<Controller.typicalResponse> {
    // router 有權限檢查的 middleware (製作中) -> 從資料庫取得資料 -> 檢查返回的資料格式 -> 給資料
    try {
        const reqParam = req.params;

        const result = await Service.Lang.getLimitWordsData(reqParam);

        // TODO 中 檢查返回的資料格式
        if (result /*&& await Service.Lang.checkResponseWordsContentFormat(result)*/ ) {
            return { status: ErrorPackage.HttpStatus.OK, result };
        }

    } catch (error) {
        console.error("createWordsHandler 錯誤", error);
        return { status: ErrorPackage.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    }
    return { status: ErrorPackage.HttpStatus.NO_DATA, result: false };
}


async function addLanguageHandler(req: Express.Request): Promise<Controller.typicalResponse> {
    // 檢查格式 -> 檢查重複欄位 -> 插入新欄位 -> 更新 redis 語言列表
    try {
        // 限定在 'a-Z', '-'
        let [error, validationErrorCode] = await Service.Lang.checkLangColumnValidation(req);
        if (error) {
            return { status: validationErrorCode, result: false };
        }

        const reqBodyData = req.body;

        if (await Service.Lang.checkLangColumnRepeat(reqBodyData) ) {
            return { status: ErrorPackage.HttpStatus.ERROR_ALREADY_EXIST_LANGUAGE, result: false}
        }

        await Service.Lang.addOneLangColumnToDB(reqBodyData);

    } catch (error) {
        console.error("addLanguageHandler 錯誤", error);
        return { status: ErrorPackage.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    }
    return { status: ErrorPackage.HttpStatus.OK, result: true };
}


async function addWordsHandler(req: Express.Request): Promise<Controller.typicalResponse> {
    //  validation -> 確認是否有符合語言名單 -> checkExist -> insertModel -> response_OK.
    try {
        // 只驗證 name 全英文分大小寫+數字
        const [error, validationErrorCode] = await Service.Lang.checkWordsValidation(req);
        if(error) {
            return { status: validationErrorCode, result: false };
        }

        const reqBodyData = req.body;

        // 確認是否有符合語言名單 若是 input { name, en, cht } 可是lang list 只有 { name, en }，
        // 是不是代表客端錯誤或是增加語言欄位的功能發生錯誤？
        if (!await Service.Lang.checkWordsDataMatchLangColumn(reqBodyData)) {
            return { status: ErrorPackage.HttpStatus.ERROR_LANG_COLUMN_OVERFLOW, result: false };
        }

        // 確認內容重複，並把跟資料庫重複的工作交給資料庫來解決
        const [hasRepeat, repeatData] = await Service.Lang.checkWordsRepeat(reqBodyData);

        // TODO
        // await Service.Lang.removeRepeatWordsFromReqBodyData(reqBodyData, repeatData);
        // await Service.Lang.insertWordsIntoDB(reqBodyData);

        // 即使重複還是可以插入，只是發出警告
        if (hasRepeat) {
            return { status: ErrorPackage.HttpStatus.WARNING_REPEAT_WORD, result: repeatData }
        }
    } catch (error) {
        console.error("createWordsHandler 錯誤", error);
        return { status: ErrorPackage.HttpStatus.INTERNAL_SERVER_ERROR, result: false }
    }
    return { status: ErrorPackage.HttpStatus.OK, result: true };
}

// async function deleteWordHandler(req) {
//     // delete multiple data -> validation -> check exist -> delete data
//     try {
//         // 只驗證 name 全英文分大小寫+數字
//         const ab = await Service.Lang.wordValidation(req);
//         console.log(233, ab);

//         if(!await Service.Lang.wordValidation(req)) {
//             return { status: ErrorPackage.HttpStatus.ERROR_NAME_FORMAT, result: false}
//         }

//         const reqBodyData  = req.body;

//         const a = await Service.Lang.checkWordExist(reqBodyData);
//         console.log(344, a);

//         if (!await Service.Lang.checkWordExist(reqBodyData)) {
//             return { status: ErrorPackage.HttpStatus.ERROR_NOT_EXIST_WORD, result: false };
//         }





//     } catch (error) {
//         return { status: ErrorPackage.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
//     }
//     return { status: ErrorPackage.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
// }

export default {
    getLanguageListHandler,
    getWordsContentHandler,
    addLanguageHandler,
    addWordsHandler,
    // deleteWordHandler,
};
