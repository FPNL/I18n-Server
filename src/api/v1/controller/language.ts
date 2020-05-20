// Package
import Express from 'express';
// Module
import { HttpStatus, HttpStatusMessage } from '../../../package/httpStatus';
import * as langService from '../service/language';
// Typing
import { ControllerDeclare } from './controller';
import { ServiceDeclare } from '../service/service';


async function getLanguageListHandler(): Promise<ControllerDeclare.typicalResponse> {
    // router 有權限檢查的 middleware  -> 給資料.
    try {
        const result = await langService.getLangList();
        if (result /*&& await Service.Lang.checkResponseLangColumnFormat(result)*/) {
            return { status: HttpStatus.OK, result };
        }

    } catch (error) {
        console.error("getLanguageListHandler 錯誤", error);
        return { status: HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    }
    return { status: HttpStatus.NO_DATA, result: false };
}

async function getWordsContentHandler(req: Express.Request): Promise<ControllerDeclare.typicalResponse> {
    // router 有權限檢查的 middleware  -> 從資料庫取得資料 -> ?檢查返回的資料格式? -> 給資料
    try {
        const reqParam = <{ limit?: string; page?: string; }>req.params;

        const result = await langService.getLimitWordsData(reqParam);

        if (result) {
            return { status: HttpStatus.OK, result };
        }

    } catch (error) {
        console.error("createWordsHandler 錯誤", error);
        return { status: HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    }
    return { status: HttpStatus.NO_DATA, result: false };
}


async function addLanguageHandler(req: Express.Request): Promise<ControllerDeclare.typicalResponse> {
    // 檢查格式 -> 檢查重複欄位 -> 插入新欄位 -> 更新 redis 語言列表
    try {
        const reqBodyData = <{ lang: string; }>req.body;

        // 限定在 'a-Z', '-'
        let [error, validationErrorCode] = await langService.checkLangColumnValidation(req);
        if (error) {
            return { status: validationErrorCode, result: false };
        }

        if (await langService.checkLangHasExist(reqBodyData)) {
            return { status: HttpStatus.ERROR_ALREADY_EXIST_LANGUAGE, result: false };
        }

        const result = await langService.addOneLangToDB(reqBodyData);
        if (!result) {
            throw new Error("新增語言至資料庫失敗");
        }

        // await langService.setLangListIntoRedis(reqBodyData);

    } catch (error) {
        console.error("addLanguageHandler 錯誤", error);
        return { status: HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    }
    return { status: HttpStatus.OK, result: true };
}


async function addWordsHandler(req: Express.Request): Promise<ControllerDeclare.typicalResponse> {
    //  validation -> 確認是否有符合語言名單 -> checkExist -> insertModel -> response_OK.
    try {
        const reqBodyData = <ServiceDeclare.wordsFormat>req.body;

        // 驗證 name 全英文分大小寫+數字 content key 錯誤
        let [error, validationErrorCode] = await langService.checkWordsValidation(req);
        if (error) {
            return { status: validationErrorCode, result: false };
        }

        // 確認是否有符合語言名單 若是 input { name, en, cht } 可是lang list 只有 { name, en }，
        // 是不是代表客端錯誤或是增加語言欄位的功能發生錯誤？
        let [errorNotMatch, wrongLang] = await langService.checkWordsDataMatchLangs(reqBodyData);
        if (errorNotMatch) {
            return { status: HttpStatus.ERROR_LANG_COLUMN_OVERFLOW, result: wrongLang };
        }

        const [isInsideDataRepeat, repeatDataInReqBody] = langService.checkRepeatInsideReqBodyData(reqBodyData);
        if (isInsideDataRepeat) {
            return { status: HttpStatus.WARNING_REPEAT_WORD, result: repeatDataInReqBody };
        }

        // 確認內容重複，並把跟資料庫重複的工作交給資料庫來解決
        const [hasRepeat, repeatData] = await langService.checkWordsExistInDB(reqBodyData);
        // 重複不行插入，並發出警告
        if (hasRepeat) {
            return { status: HttpStatus.WARNING_REPEAT_WORD, result: repeatData };
        }

        // 待定
        // error = await Service.Lang.removeRepeatWordsFromReqBodyData(reqBodyData, repeatData);
        // if (error) {
        //     throw ErrorPackage.HttpStatus.ERROR_DATA_FORMAT;
        // }

        error = await langService.insertWordsIntoDB(reqBodyData);
        if (error) {
            throw HttpStatusMessage.get(HttpStatus.WARNING_REPEAT_WORD);
        }

    } catch (error) {
        console.error("createWordsHandler 錯誤 : ", error);
        return { status: HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    }
    return { status: HttpStatus.OK, result: true };
}

async function alterWordsHandler(req: Express.Request): Promise<ControllerDeclare.typicalResponse> {
    // 跟 createWordsHandler 很像
    // name and content validation -> 更新的語言都有符合 config.langs -> check 資料內部沒有重複 -> 檢查資料與資料庫都有相對應的存在  -> update model.
    try {
        const reqBodyData = <ServiceDeclare.wordsFormat>req.body;

        let [error, validationErrorCode] = await langService.checkWordsValidation(req);
        if (error) {
            return { status: validationErrorCode, result: false };
        }

        const [errorNotMatch, wrongLang] = await langService.checkWordsDataMatchLangs(reqBodyData);
        if (errorNotMatch) {
            return { status: HttpStatus.ERROR_LANG_COLUMN_OVERFLOW, result: wrongLang };
        }

        const [isInsideDataRepeat, repeatDataInReqBody] = langService.checkRepeatInsideReqBodyData(reqBodyData);
        if (isInsideDataRepeat) {
            return { status: HttpStatus.WARNING_REPEAT_WORD, result: repeatDataInReqBody };
        }

        const [isNotExist, ghostData] = await langService.checkWordsNotExistInDB(reqBodyData);
        if (isNotExist) {
            return { status: HttpStatus.ERROR_NOT_EXIST_WORD, result: ghostData };
        }

        error = await langService.updateWordsIntoDB(reqBodyData);
        if (error) {
            throw HttpStatusMessage.get(HttpStatus.WARNING_REPEAT_WORD);
        }

    } catch (error) {
        console.error("alterWordsHandler 錯誤 : ", error);
        return { status: HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    }
    return { status: HttpStatus.OK, result: true };
}

async function deleteWordsHandler(req: Express.Request): Promise<ControllerDeclare.typicalResponse> {
    // delete multiple data 傳來格式應該為 {"data": ["name1", "name2"] } -> name validation -> check exist -> delete data
    try {
        const reqBodyData = <{ data: Array<string>; }>req.body;
        // 驗證 name 全英文分大小寫+數字
        let [error, validationErrorCode] = await langService.checkNameValidation(req);
        if (error) {
            return { status: validationErrorCode, result: false };
        }

        const [isNotExist, ghostData] = await langService.checkWordsNotExistInDB(reqBodyData);
        if (isNotExist) {
            return { status: HttpStatus.ERROR_NOT_EXIST_WORD, result: ghostData };
        }

        error = await langService.deleteWordsFromDB(reqBodyData);
        if (error) {
            throw HttpStatusMessage.get(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    } catch (error) {
        console.error("deleteWordsHandler 錯誤 : ", error);
        return { status: HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    }
    return { status: HttpStatus.OK, result: true };
}

async function deleteLangHandler(req: Express.Request): Promise<ControllerDeclare.typicalResponse> {
    // validation is string alphanumberic -> check config exist -> delete
    try {
        const reqBodyData = <{ lang: string; }>req.body;

        // 限定在 'a-Z', '-'
        let [error, validationErrorCode] = await langService.checkLangColumnValidation(req);
        if (error) {
            return { status: validationErrorCode, result: false };
        }

        const langList = await langService.getLangList();
        if (!langList) {
            return { status: HttpStatus.ERROR_NOT_EXIST_LANGUAGE, result: false };
        } else if (langList.length === 1) {
            return { status: HttpStatus.WARNING_LANG_AT_LEAST_ONE, result: false };
        }

        if (!await langService.checkLangHasExist(reqBodyData, langList)) {
            return { status: HttpStatus.ERROR_NOT_EXIST_LANGUAGE, result: false };
        }

        error = await langService.deleteLangFromDB(reqBodyData);
        if (error) {
            throw HttpStatusMessage.get(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // await langService.removeLangListFromRedis(reqBodyData);

    } catch (error) {
        console.error("deleteLangHandler 錯誤 : ", error);
        return { status: HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    }

    return { status: HttpStatus.OK, result: true };
}

async function getNativeLanguageHandler(): Promise<ControllerDeclare.typicalResponse> {
    try {
        // 檢查權限 -> 給資料
        const currentLang = await langService.getNativeLanguage();
        if (!currentLang) {
            return { status: HttpStatus.ERROR_NOT_EXIST_LANGUAGE, result: false };
        }

        // await langService.setNativeLangIntoRedis({ lang: currentLang });

        return { status: HttpStatus.OK, result: currentLang };
    } catch (error) {
        console.error("getNativeLanguageHandler 錯誤 : ", error);
        return { status: HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    }
}

async function updateNativeLangHandler(req: Express.Request): Promise<ControllerDeclare.typicalResponse> {
    try {
        // value validation -> check if it exist in list -> not same update
        const reqBodyData = <{ lang: string; }>req.body;

        // 限定在 'a-Z', '-'
        let [error, validationErrorCode] = await langService.checkLangColumnValidation(req);
        if (error) {
            return { status: validationErrorCode, result: false };
        }

        if (!await langService.checkLangHasExist(reqBodyData)) {
            return { status: HttpStatus.ERROR_NOT_EXIST_LANGUAGE, result: false };
        }

        const currentLang = await langService.getNativeLanguage();
        if (currentLang === reqBodyData.lang) {
            return { status: HttpStatus.OK, result: true };
        }

        await langService.updateNativeLang(reqBodyData);

        // await langService.setNativeLangIntoRedis(reqBodyData);

    } catch (error) {
        console.error("updateNativeLangHandler 錯誤 : ", error);
        return { status: HttpStatus.INTERNAL_SERVER_ERROR, result: false };
    }
    return { status: HttpStatus.OK, result: true };
}

// async function r_getNativeLangHandler() {
//     try {
//         const keyName = 'nativeLang';
//         const hasKey = await langService.checkKeyExistFromRedis(keyName);
//         if (!hasKey) {
//             return { status: HttpStatus.WARNING_NOT_EXIST_KEY, result: false };
//         }
//         const result = await langService.getNativeLangFromRedis();
//         if (result) {
//             return { status: HttpStatus.OK, result };
//         }
//     } catch (error) {
//         console.error("r_getNativeLangHandler 錯誤", error);
//         return { status: HttpStatus.INTERNAL_SERVER_ERROR, result: false };
//     }
//     return { status: HttpStatus.NO_DATA, result: false };
// }

// async function r_getLangListHandler(): Promise<ControllerDeclare.typicalResponse> {
//     // check has key -> 給資料.
//     // router 有權限檢查的 middleware  -> 給資料.
//     try {
//         const keyName = 'langs';
//         const hasKey = await langService.checkKeyExistFromRedis(keyName);
//         if (!hasKey) {
//             return { status: HttpStatus.WARNING_NOT_EXIST_KEY, result: false };
//         }
//         const result = await langService.getLangListFromRedis();
//         if (result.length /*&& await Service.Lang.checkResponseLangColumnFormat(result)*/) {
//             return { status: HttpStatus.OK, result };
//         }
//     } catch (error) {
//         console.error("getLanguageListHandler 錯誤", error);
//         return { status: HttpStatus.INTERNAL_SERVER_ERROR, result: false };
//     }
//     return { status: HttpStatus.NO_DATA, result: false };
// }

export {
    getLanguageListHandler,
    getWordsContentHandler,
    addLanguageHandler,
    addWordsHandler,
    alterWordsHandler,
    deleteWordsHandler,
    deleteLangHandler,
    updateNativeLangHandler,
    getNativeLanguageHandler,
    // r_getLangListHandler,
    // r_getNativeLangHandler
};
