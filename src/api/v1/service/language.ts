// Package
import * as Validator from 'express-validator';
import Express from 'express';
// Module
import * as langModel from '../model/language';
import * as util from '../util';
import { HttpStatus } from '../../../package/httpStatus';
// Typing
import { ServiceDeclare } from './service';

async function setNativeLangIntoRedis(reqBodyData: { lang: string; }) {
    return await langModel.r_setNativeLang(reqBodyData.lang);
}

async function getNativeLangFromRedis() {
    return await langModel.r_getNativeLang();
}

async function setLangListIntoRedis(reqBodyData: { lang: string; }): Promise<boolean> {
    const result = await langModel.r_setLangSet(reqBodyData.lang);
    return result;
}

async function getLangListFromRedis(): Promise<Array<string>> {
    const result = await langModel.r_getLangSet();
    return result;
}

async function removeLangListFromRedis(reqBodyData: { lang: string; }) {
    const result = await langModel.r_removeLangSet(reqBodyData.lang);
    return result;
}

async function getLangList(reqBodyData?: any): Promise<Array<string> | undefined> {
    const result = await langModel.readLanguageList();
    return result?.langs;
}

async function getLimitWordsData(reqParam: { limit?: string; page?: string; }): Promise<Array<ServiceDeclare.wordFormat>> {
    const params = { limit: parseInt(reqParam.limit ?? '50'), skip: parseInt(reqParam.page ?? '0') };
    return await langModel.readWordsData(null, params);
}


async function checkLangColumnValidation(req: Express.Request): Promise<[boolean, number]> {
    const langColumnCheck = Validator.check('lang').custom(value => !!value.match(/^[\w\-]+$/));
    await langColumnCheck(req, null, () => { });
    const [err, result] = await util.validationErrorHandler(req);
    if (err) {
        return [err, HttpStatus.ERROR_LANG_COLUMN_FORMAT];
    }
    return [err, HttpStatus.OK];
}

async function checkLangHasExist(reqBodyData: { lang: string; }, langList?: (string[] | undefined)): Promise<boolean | undefined> {
    if (!langList) {
        const dbData = await langModel.readLanguageList();
        langList = dbData?.langs;
    }

    const ifLangHasExisted = langList?.some(value => value === reqBodyData.lang);
    return ifLangHasExisted;
}

async function addOneLangToDB(reqBodyData: { lang: string; }) {
    return await langModel.updateLanguageByPushing(reqBodyData);
}

async function checkNameValidation(req: Express.Request): Promise<[boolean, number]> {
    const namesCheck = Validator.check('data.*').isAlphanumeric();
    await namesCheck(req, null, () => { });
    const [err, result] = await util.validationErrorHandler(req);
    if (err) {
        return [err, HttpStatus.ERROR_NAME_FORMAT];
    }
    return [err, HttpStatus.OK];
}

async function checkWordsValidation(req: Express.Request): Promise<[boolean, number]> {
    let errorCode = HttpStatus.OK;

    const dataCheck = Validator.body('data').isArray({ min: 1 });
    const namesCheck = Validator.body('data.*.name').isAlphanumeric();
    const contentCheck = Validator.body('data.*.content').custom((content: ServiceDeclare.wordContent): boolean => {
        if (content) {
            for (const lang in content) {
                if (content.hasOwnProperty(lang) && !lang.match(/^[\w\-]+$/)) {
                    throw new Error(`data.content 的 ${lang} 錯誤，須為 "a-Z", "0-9", "-", "_"`);
                }
            }
        } else {
            errorCode = HttpStatus.ERROR_DATA_FORMAT;
        }
        return true;
    });


    await dataCheck(req, null, () => { });
    await namesCheck(req, null, () => { });
    await contentCheck(req, null, () => { });

    const [err, result] = await util.validationErrorHandler(req);
    if (err) {
        if (result.includes('.name')) {
            errorCode = HttpStatus.ERROR_NAME_FORMAT;
        } else if (result.includes('.content')) {
            errorCode = HttpStatus.ERROR_CONTENT_FORMAT;
        } else if (result === 'data') {
            errorCode = HttpStatus.ERROR_DATA_FORMAT;
        }
        return [err, errorCode];
    }
    return [false, errorCode];
}
/**
 * 時間複雜度 O(n*m)
 * n = content.length * data.length;
 * m = langs.length;
 */
async function checkWordsDataMatchLangs(reqBodyData: ServiceDeclare.wordsFormat): Promise<[boolean, any]> {
    const result = await langModel.readLanguageList();

    if (result && result.langs) {
        const { langs } = result;
        let notMatchedData: string | undefined = "";
        const everyDataMatched = reqBodyData.data.every(eachData => {
            if (!eachData.hasOwnProperty("content") || !eachData.content) {
                eachData.content = {};
                return true;
            }
            const reqKeys = Object.keys(eachData.content);
            notMatchedData = reqKeys.find(column => !langs.includes(column));
            console.log(133, notMatchedData);

            return !notMatchedData; // 左側為縮寫，完整句子： if (notMatchedData) { return false; } else { return true; }
        });

        return [!everyDataMatched, notMatchedData ?? ""];
    }
    return [true, '尚未建立語言'];
}

// 有兩種 repeat 一種是內部重複 另種是 跟資料庫重複

function checkRepeatInsideReqBodyData(reqBodyData: ServiceDeclare.wordsFormat): [boolean, Array<string>] {
    const namesArr = reqBodyData.data.map(value => value.name);
    const findDuplicates = (arr: string[]) => arr.filter((item, index) => arr.indexOf(item) !== index);
    const repeatNamesArr = [...new Set(findDuplicates(namesArr))];
    return [repeatNamesArr.length > 0, repeatNamesArr];
}

async function checkWordsExistInDB(reqBodyData: ServiceDeclare.wordsFormat): Promise<[boolean, Array<string>]> {
    const namesArr = reqBodyData.data.map(value => value.name);
    const result = await langModel.readWordsInName(namesArr);
    const repeatNamesArr = result.map(v => v.name);
    return [result.length > 0, repeatNamesArr];
}

async function checkWordsNotExistInDB(reqBodyData: (ServiceDeclare.wordsFormat | { data: Array<string>; })): Promise<[boolean, Array<string>]> {
    // @ts-ignore
    const namesArr = reqBodyData.data.map(value => value.name ?? value);

    const result = await langModel.readWordsInName(namesArr);
    console.log(123, result);
    const repeatNamesArr = result.map(v => v.name);
    const wordNotInDB = namesArr.filter(v => !repeatNamesArr.includes(v));
    return [wordNotInDB.length > 0, wordNotInDB];
}

async function removeRepeatWordsFromReqBodyData(reqBodyData: ServiceDeclare.wordsFormat, repeatData: any[]): Promise<boolean> {
    try {
        reqBodyData.data = reqBodyData.data.filter(value => {
            const isNameRepeat = repeatData.some(val => val.name === value.name);
            return !isNameRepeat;
        });
        return false;
    } catch (error) {
        return true;
    }
}

async function insertWordsIntoDB(reqBodyData: ServiceDeclare.wordsFormat): Promise<boolean> {
    const { data } = reqBodyData;
    try {
        await langModel.insertWords(data);
        return false;
    } catch (error) {
        return true;
    }
}

async function updateWordsIntoDB(reqBodyData: ServiceDeclare.wordsFormat): Promise<boolean> {
    const { data } = reqBodyData;
    try {
        await langModel.updateWords(data);
        return false;
    } catch (error) {
        return true;
    }
}

// 返回錯誤 採 go 概念
async function deleteWordsFromDB(reqBodyData: { data: Array<string>; }): Promise<boolean> {
    const { data } = reqBodyData;
    try {
        const { deletedCount } = await langModel.deleteWords(data);
        return !(deletedCount === data.length);
    } catch (error) {
        return false;
    }

}

async function deleteLangFromDB(reqBodyData: { lang: string; }): Promise<boolean> {
    const { lang } = reqBodyData;
    try {
        await langModel.deleteLang(lang);
        return false;
    } catch (error) {
        return true;
    }
}

async function checkKeyExistFromRedis(keyName: string): Promise<boolean> {
    return await langModel.r_getKeyExist(keyName);
}

async function getNativeLanguage(): Promise<string | undefined> {
    const result = await langModel.readNativeLang();
    return result?.nativeLang;
}

async function updateNativeLang(reqBodyData: { lang: string; }) {
    return await langModel.updateNativeLang(reqBodyData.lang);
}

export {
    getLangList,
    getLimitWordsData,
    checkLangColumnValidation,
    checkLangHasExist,
    addOneLangToDB,
    checkWordsValidation,
    checkWordsDataMatchLangs,
    checkRepeatInsideReqBodyData,
    checkWordsExistInDB,
    checkWordsNotExistInDB,
    removeRepeatWordsFromReqBodyData,
    insertWordsIntoDB,
    updateWordsIntoDB,
    checkNameValidation,
    deleteWordsFromDB,
    deleteLangFromDB,
    setLangListIntoRedis,
    getLangListFromRedis,
    removeLangListFromRedis,
    setNativeLangIntoRedis,
    checkKeyExistFromRedis,
    getNativeLangFromRedis,
    getNativeLanguage,
    updateNativeLang,
};
