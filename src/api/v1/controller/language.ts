import Express = require('express');

import e from '../../../package/e';
import service from '../service';
import { ControllerDeclare } from './controller';
import { ServiceDeclare } from '../service/service';


async function getLanguageListHandler(): Promise<ControllerDeclare.typicalResponse> {
    // router 有權限檢查的 middleware  -> 給資料.
    try {
        const result = await service.Lang.getLangList();
        if (result /*&& await Service.Lang.checkResponseLangColumnFormat(result)*/) {
            return { status: e.HttpStatus.OK, result };
        }

    } catch (error) {
        console.error("getLanguageListHandler 錯誤", error);
        return { status: e.HttpStatus.INTERNAL_SERVER_ERROR, result: false}
    }
    return { status: e.HttpStatus.NO_DATA, result: false };
}

async function r_getLangListHandler(): Promise<ControllerDeclare.typicalResponse> {
    // check has key -> 給資料.
    // router 有權限檢查的 middleware  -> 給資料.
    try {
        const keyName = 'langs';
        const hasKey = await service.Lang.checkKeyExist(keyName);
        if (!hasKey) {
            return { status: e.HttpStatus.WARNING_NOT_EXIST_KEY, result: false };
        }

        const result = await service.Lang.getLangListFromRedis();
        if (result.length /*&& await Service.Lang.checkResponseLangColumnFormat(result)*/) {
            return { status: e.HttpStatus.OK, result };
        }

    } catch (error) {
        console.error("getLanguageListHandler 錯誤", error);
        return { status: e.HttpStatus.INTERNAL_SERVER_ERROR, result: false}
    }
    return { status: e.HttpStatus.NO_DATA, result: false };
}


async function getWordsContentHandler(req: Express.Request): Promise<ControllerDeclare.typicalResponse> {
    // router 有權限檢查的 middleware  -> 從資料庫取得資料 -> ?檢查返回的資料格式? -> 給資料
    try {
        const reqParam = <{ limit?: string; page?: string;}>req.params;

        const result = await service.Lang.getLimitWordsData(reqParam);

        if (result) {
            return { status: e.HttpStatus.OK, result };
        }

    } catch (error) {
        console.error("createWordsHandler 錯誤", error);
        return { status: e.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    }
    return { status: e.HttpStatus.NO_DATA, result: false };
}


async function addLanguageHandler(req: Express.Request): Promise<ControllerDeclare.typicalResponse> {
    // 檢查格式 -> 檢查重複欄位 -> 插入新欄位 -> 更新 redis 語言列表
    try {
        const reqBodyData = <{ lang: string; }>req.body;

        // 限定在 'a-Z', '-'
        let [error, validationErrorCode] = await service.Lang.checkLangColumnValidation(req);
        if (error) {
            return { status: validationErrorCode, result: false };
        }

        if (await service.Lang.checkLangHasExist(reqBodyData) ) {
            return { status: e.HttpStatus.ERROR_ALREADY_EXIST_LANGUAGE, result: false}
        }

        await service.Lang.addOneLangToDB(reqBodyData);

        await service.Lang.setLangListIntoRedis(reqBodyData);

    } catch (error) {
        console.error("addLanguageHandler 錯誤", error);
        return { status: e.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    }
    return { status: e.HttpStatus.OK, result: true };
}


async function addWordsHandler(req: Express.Request): Promise<ControllerDeclare.typicalResponse> {
    //  validation -> 確認是否有符合語言名單 -> checkExist -> insertModel -> response_OK.
    try {
        const reqBodyData = <ServiceDeclare.wordsFormat>req.body;

        // 驗證 name 全英文分大小寫+數字 content key 錯誤
        let [error, validationErrorCode] = await service.Lang.checkWordsValidation(req);
        if(error) {
            return { status: validationErrorCode, result: false };
        }

        // 確認是否有符合語言名單 若是 input { name, en, cht } 可是lang list 只有 { name, en }，
        // 是不是代表客端錯誤或是增加語言欄位的功能發生錯誤？
        let [errorNotMatch, wrongLang] = await service.Lang.checkWordsDataMatchLangs(reqBodyData);
        if (errorNotMatch) {
            return { status: e.HttpStatus.ERROR_LANG_COLUMN_OVERFLOW, result: wrongLang };
        }

        const [isInsideDataRepeat, repeatDataInReqBody] = service.Lang.checkRepeatInsideReqBodyData(reqBodyData);
        if (isInsideDataRepeat) {
            return { status: e.HttpStatus.WARNING_REPEAT_WORD, result: repeatDataInReqBody }
        }

        // 確認內容重複，並把跟資料庫重複的工作交給資料庫來解決
        const [hasRepeat, repeatData] = await service.Lang.checkWordsExistInDB(reqBodyData);
        // 重複不行插入，並發出警告
        if (hasRepeat) {
            return { status: e.HttpStatus.WARNING_REPEAT_WORD, result: repeatData }
        }

        // 待定
        // error = await Service.Lang.removeRepeatWordsFromReqBodyData(reqBodyData, repeatData);
        // if (error) {
        //     throw ErrorPackage.HttpStatus.ERROR_DATA_FORMAT;
        // }

        error = await service.Lang.insertWordsIntoDB(reqBodyData);
        if (error) {
            throw e.HttpStatusMessage.get(e.HttpStatus.WARNING_REPEAT_WORD);
        }

    } catch (error) {
        console.error("createWordsHandler 錯誤 : ", error);
        return { status: e.HttpStatus.INTERNAL_SERVER_ERROR, result: false }
    }
    return { status: e.HttpStatus.OK, result: true };
}

async function alterWordsHandler(req: Express.Request): Promise<ControllerDeclare.typicalResponse> {
    // 跟 createWordsHandler 很像
    // name and content validation -> 更新的語言都有符合 config.langs -> check 資料內部沒有重複 -> 檢查資料與資料庫都有相對應的存在  -> update model.
    try {
        const reqBodyData = <ServiceDeclare.wordsFormat>req.body;

        let [error, validationErrorCode] = await service.Lang.checkWordsValidation(req);
        if(error) {
            return { status: validationErrorCode, result: false };
        }

        const [errorNotMatch, wrongLang] = await service.Lang.checkWordsDataMatchLangs(reqBodyData);
        if (errorNotMatch) {
            return { status: e.HttpStatus.ERROR_LANG_COLUMN_OVERFLOW, result: wrongLang };
        }

        const [isInsideDataRepeat, repeatDataInReqBody] = service.Lang.checkRepeatInsideReqBodyData(reqBodyData);
        if (isInsideDataRepeat) {
            return { status: e.HttpStatus.WARNING_REPEAT_WORD, result: repeatDataInReqBody }
        }

        const [isNotExist, ghostData] = await service.Lang.checkWordsNotExistInDB(reqBodyData);
        if (isNotExist) {
            return { status: e.HttpStatus.ERROR_NOT_EXIST_WORD, result: ghostData }
        }

        error = await service.Lang.updateWordsIntoDB(reqBodyData);
        if (error) {
            throw e.HttpStatusMessage.get(e.HttpStatus.WARNING_REPEAT_WORD);
        }

    } catch (error) {
        console.error("alterWordsHandler 錯誤 : ", error);
        return { status: e.HttpStatus.INTERNAL_SERVER_ERROR, result: false }
    }
    return { status: e.HttpStatus.OK, result: true };
}

async function deleteWordsHandler(req: Express.Request): Promise<ControllerDeclare.typicalResponse> {
    // delete multiple data 傳來格式應該為 {"data": ["name1", "name2"] } -> name validation -> check exist -> delete data
    try {
        const reqBodyData = <{data: Array<string>}>req.body;
        // 驗證 name 全英文分大小寫+數字
        let [error, validationErrorCode] = await service.Lang.checkNameValidation(req);
        if(error) {
            return { status: validationErrorCode, result: false };
        }

        const [isNotExist, ghostData] = await service.Lang.checkWordsNotExistInDB(reqBodyData);
        if (isNotExist) {
            return { status: e.HttpStatus.ERROR_NOT_EXIST_WORD, result: ghostData }
        }

        error = await service.Lang.deleteWordsFromDB(reqBodyData);
        if (error) {
            throw e.HttpStatusMessage.get(e.HttpStatus.INTERNAL_SERVER_ERROR);
        }

    } catch (error) {
        console.error("deleteWordsHandler 錯誤 : ", error);
        return { status: e.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    }
    return { status: e.HttpStatus.OK, result: true };
}

async function deleteLangHandler(req: Express.Request): Promise<ControllerDeclare.typicalResponse> {
    // validation is string alphanumberic -> check config exist -> delete
    try {
        const reqBodyData = <{lang: string}>req.body;

        // 限定在 'a-Z', '-'
        let [error, validationErrorCode] = await service.Lang.checkLangColumnValidation(req);
        if (error) {
            return { status: validationErrorCode, result: false };
        }

        if (!await service.Lang.checkLangHasExist(reqBodyData) ) {
            return { status: e.HttpStatus.ERROR_NOT_EXIST_LANGUAGE, result: false}
        }

        error = await service.Lang.deleteLangFromDB(reqBodyData);
        if (error) {
            throw e.HttpStatusMessage.get(e.HttpStatus.INTERNAL_SERVER_ERROR);
        }

        await service.Lang.removeLangListFromRedis(reqBodyData);

    } catch (error) {
        console.error("deleteLangHandler 錯誤 : ", error);
        return { status: e.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    }

    return { status: e.HttpStatus.OK, result: true };
}

export default {
    getLanguageListHandler,
    getWordsContentHandler,
    addLanguageHandler,
    addWordsHandler,
    alterWordsHandler,
    deleteWordsHandler,
    deleteLangHandler,
    r_getLangListHandler
};
