import Express = require('express');

import ErrorPackage from '../../../package/e';
import Service from '../service';
import { Controller } from './controller';
import { Service as ServiceDeclare } from '../service/service';


async function getLanguageListHandler(): Promise<Controller.typicalResponse> {
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
        const reqParam = <{ limit?: string; page?: string;}>req.params;

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
        const reqBodyData = <{ lang: string; }>req.body;

        // 限定在 'a-Z', '-'
        let [error, validationErrorCode] = await Service.Lang.checkLangColumnValidation(req);
        if (error) {
            return { status: validationErrorCode, result: false };
        }

        if (await Service.Lang.checkLangHasExist(reqBodyData) ) {
            return { status: ErrorPackage.HttpStatus.ERROR_ALREADY_EXIST_LANGUAGE, result: false}
        }

        await Service.Lang.addOneLangToDB(reqBodyData);

    } catch (error) {
        console.error("addLanguageHandler 錯誤", error);
        return { status: ErrorPackage.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    }
    return { status: ErrorPackage.HttpStatus.OK, result: true };
}


async function addWordsHandler(req: Express.Request): Promise<Controller.typicalResponse> {
    //  validation -> 確認是否有符合語言名單 -> checkExist -> insertModel -> response_OK.
    try {
        const reqBodyData = <ServiceDeclare.wordsFormat>req.body;

        // 驗證 name 全英文分大小寫+數字 content key 錯誤
        let [error, validationErrorCode] = await Service.Lang.checkWordsValidation(req);
        if(error) {
            return { status: validationErrorCode, result: false };
        }

        // 確認是否有符合語言名單 若是 input { name, en, cht } 可是lang list 只有 { name, en }，
        // 是不是代表客端錯誤或是增加語言欄位的功能發生錯誤？
        let [errorNotMatch, wrongLang] = await Service.Lang.checkWordsDataMatchLangs(reqBodyData);
        if (errorNotMatch) {
            return { status: ErrorPackage.HttpStatus.ERROR_LANG_COLUMN_OVERFLOW, result: wrongLang };
        }

        const [isInsideDataRepeat, repeatDataInReqBody] = Service.Lang.checkRepeatInsideReqBodyData(reqBodyData);
        if (isInsideDataRepeat) {
            return { status: ErrorPackage.HttpStatus.WARNING_REPEAT_WORD, result: repeatDataInReqBody }
        }

        // 確認內容重複，並把跟資料庫重複的工作交給資料庫來解決
        const [hasRepeat, repeatData] = await Service.Lang.checkWordsExistInDB(reqBodyData);
        // 重複不行插入，並發出警告
        if (hasRepeat) {
            return { status: ErrorPackage.HttpStatus.WARNING_REPEAT_WORD, result: repeatData }
        }

        // 待定
        // error = await Service.Lang.removeRepeatWordsFromReqBodyData(reqBodyData, repeatData);
        // if (error) {
        //     throw ErrorPackage.HttpStatus.ERROR_DATA_FORMAT;
        // }

        error = await Service.Lang.insertWordsIntoDB(reqBodyData);
        if (error) {
            throw ErrorPackage.HttpStatusMessage.get(ErrorPackage.HttpStatus.WARNING_REPEAT_WORD);
        }

    } catch (error) {
        console.error("createWordsHandler 錯誤 : ", error);
        return { status: ErrorPackage.HttpStatus.INTERNAL_SERVER_ERROR, result: false }
    }
    return { status: ErrorPackage.HttpStatus.OK, result: true };
}

async function alterWordsHandler(req: Express.Request): Promise<Controller.typicalResponse> {
    // 跟 createWordsHandler 很像
    // name and content validation -> 更新的語言都有符合 config.langs -> check 資料內部沒有重複 -> 檢查資料與資料庫都有相對應的存在  -> update model.
    try {
        const reqBodyData = <ServiceDeclare.wordsFormat>req.body;

        let [error, validationErrorCode] = await Service.Lang.checkWordsValidation(req);
        if(error) {
            return { status: validationErrorCode, result: false };
        }

        let [errorNotMatch, wrongLang] = await Service.Lang.checkWordsDataMatchLangs(reqBodyData);
        if (errorNotMatch) {
            return { status: ErrorPackage.HttpStatus.ERROR_LANG_COLUMN_OVERFLOW, result: wrongLang };
        }

        const [isInsideDataRepeat, repeatDataInReqBody] = Service.Lang.checkRepeatInsideReqBodyData(reqBodyData);
        if (isInsideDataRepeat) {
            return { status: ErrorPackage.HttpStatus.WARNING_REPEAT_WORD, result: repeatDataInReqBody }
        }

        const [isNotExist, ghostData] = await Service.Lang.checkWordsNotExistInDB(reqBodyData);
        if (isNotExist) {
            return { status: ErrorPackage.HttpStatus.ERROR_NOT_EXIST_WORD, result: ghostData }
        }

        error = await Service.Lang.updateWordsIntoDB(reqBodyData);
        if (error) {
            throw ErrorPackage.HttpStatusMessage.get(ErrorPackage.HttpStatus.WARNING_REPEAT_WORD);
        }

    } catch (error) {
        console.error("alterWordsHandler 錯誤 : ", error);
        return { status: ErrorPackage.HttpStatus.INTERNAL_SERVER_ERROR, result: false }
    }
    return { status: ErrorPackage.HttpStatus.OK, result: true };
}

async function deleteWordsHandler(req: Express.Request): Promise<Controller.typicalResponse> {
    // delete multiple data 傳來格式應該為 {"data": ["name1", "name2"] } -> name validation -> check exist -> delete data
    try {
        const reqBodyData = <{data: Array<string>}>req.body;
        // 驗證 name 全英文分大小寫+數字
        let [error, validationErrorCode] = await Service.Lang.checkNameValidation(req);
        if(error) {
            return { status: validationErrorCode, result: false };
        }


        const [isNotExist, ghostData] = await Service.Lang.checkWordsNotExistInDB(reqBodyData);
        if (isNotExist) {
            return { status: ErrorPackage.HttpStatus.ERROR_NOT_EXIST_WORD, result: ghostData }
        }

        error = await Service.Lang.deleteWordsFromDB(reqBodyData);
        if (error) {
            throw ErrorPackage.HttpStatusMessage.get(ErrorPackage.HttpStatus.INTERNAL_SERVER_ERROR);
        }

    } catch (error) {
        console.error("deleteWordsHandler 錯誤 : ", error);
        return { status: ErrorPackage.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    }
    return { status: ErrorPackage.HttpStatus.OK, result: true };
}

async function deleteLangHandler(req: Express.Request): Promise<Controller.typicalResponse> {
    // validation is string alphanumberic -> check config exist -> delete
    try {
        const reqBodyData = <{lang: string}>req.body;

        // 限定在 'a-Z', '-'
        let [error, validationErrorCode] = await Service.Lang.checkLangColumnValidation(req);
        if (error) {
            return { status: validationErrorCode, result: false };
        }

        if (!await Service.Lang.checkLangHasExist(reqBodyData) ) {
            return { status: ErrorPackage.HttpStatus.ERROR_NOT_EXIST_LANGUAGE, result: false}
        }

        error = await Service.Lang.deleteLangFromDB(reqBodyData);
        if (error) {
            throw ErrorPackage.HttpStatusMessage.get(ErrorPackage.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    } catch (error) {
        console.error("deleteLangHandler 錯誤 : ", error);
        return { status: ErrorPackage.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    }

    return { status: ErrorPackage.HttpStatus.OK, result: true };
}

export default {
    getLanguageListHandler,
    getWordsContentHandler,
    addLanguageHandler,
    addWordsHandler,
    alterWordsHandler,
    deleteWordsHandler,
    deleteLangHandler,
};
