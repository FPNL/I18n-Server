import Validator = require('express-validator');
import Express = require('express');

// import { language: LangModel } from'../model';
import Model from'../model';
import Util from '../util';
import ErrorPackage from '../../../package/e';
import { Service } from './service';
import { LangModelType } from '../model/model';

async function TEST(reqBodyData: any) {
    const result = await Model.Lang.TEST(reqBodyData);
    console.log(result);
}

async function getLangList(reqBodyData?: any): Promise<Array<string>|undefined> {
    const result = await Model.Lang.readLanguageList();
    return result?.langs;
}

async function getLimitWordsData(reqParam: { limit?: string; page?: string; }): Promise<Array<Service.wordFormat>> {
    const params = { limit: parseInt(reqParam.limit ?? '50'), skip: parseInt(reqParam.page ?? '0') };
    return await Model.Lang.readWordsData(null, params);
}


async function checkLangColumnValidation(req: Express.Request): Promise<[boolean, number]> {
    const langColumnCheck = Validator.check('lang').custom(value => !!value.match(/^[\w\-]+$/));
    await langColumnCheck(req, null, () => { });
    const [err, result] = await Util.validationErrorHandler(req);
    if (err) {
        return [err, ErrorPackage.HttpStatus.ERROR_LANG_COLUMN_FORMAT];
    }
    return [err, ErrorPackage.HttpStatus.OK];
}

async function checkLangHasExist(reqBodyData: { lang: string }): Promise<boolean|undefined> {
    const result = await Model.Lang.readLanguageList();
    const ifLangHasExisted = result?.langs.some(value => value === reqBodyData.lang);
    return ifLangHasExisted;
}

async function addOneLangToDB(reqBodyData: { lang: string; }) {
    return await Model.Lang.updateLanguageByPushing(reqBodyData);
}

async function checkNameValidation(req: Express.Request): Promise<[boolean, number]> {
    const namesCheck = Validator.check('data.*').isAlphanumeric();
    await namesCheck(req, null, () => { });
    const [err, result] = await Util.validationErrorHandler(req);
    if (err) {
        return [err, ErrorPackage.HttpStatus.ERROR_NAME_FORMAT];
    }
    return [err, ErrorPackage.HttpStatus.OK];
}

async function checkWordsValidation(req: Express.Request): Promise<[boolean, number]> {
    const namesCheck = Validator.check('data.*.name').isAlphanumeric();
    await namesCheck(req, null, () => { });

    const contentCheck = Validator.check('data.*.content').custom((content: Service.wordContent): boolean => {
        if (content) {
            for (const lang in content) {
                if (content.hasOwnProperty(lang) && !lang.match(/^[\w\-]+$/)) {
                    throw new Error(`data.content 的 ${lang} 錯誤，須為 "a-Z", "0-9", "-", "_"`);
                }
            }
        }
        return true;
    });
    await contentCheck(req, null, () => { });

    const [err, result] = await Util.validationErrorHandler(req);
    if (err) {
        let errorCode = ErrorPackage.HttpStatus.INTERNAL_SERVER_ERROR;
        if (result.includes('.name')) {
            errorCode = ErrorPackage.HttpStatus.ERROR_NAME_FORMAT;
        } else if (result.includes('.content')) {
            errorCode = ErrorPackage.HttpStatus.ERROR_CONTENT_FORMAT;
        }
        return [err, errorCode];
    }
    return [false, ErrorPackage.HttpStatus.OK]
}
/**
 * 時間複雜度 O(n*m)
 * n = content.length * data.length;
 * m = langs.length;
 */
async function checkWordsDataMatchLangs(reqBodyData: Service.wordsFormat): Promise<[boolean, any]> {
    const result = await Model.Lang.readLanguageList();

    if (result && result.langs) {
        const { langs } = result;
        let notMatchedData: string|undefined = "";
        const everyDataMatched = reqBodyData.data.every(eachData => {
            if (!eachData.hasOwnProperty("content")) {
                return true;
            }
            const reqKeys = Object.keys(eachData.content);
            notMatchedData = reqKeys.find(column => !langs.includes(column));
            return !notMatchedData; // 左側為縮寫，完整句子： if (notMatchedData) { return false; } else { return true; }
        });

        return [!everyDataMatched, notMatchedData ?? ""];
    }
    return [true, '尚未建立語言'];
}

// 有兩種 repeat 一種是內部重複 另種是 跟資料庫重複

function checkRepeatInsideReqBodyData(reqBodyData: Service.wordsFormat): [boolean, Array<string>] {
    const namesArr = reqBodyData.data.map(value => value.name);
    const findDuplicates = (arr: string[]) => arr.filter((item, index) => arr.indexOf(item) !== index)
    const repeatNamesArr = [...new Set(findDuplicates(namesArr))];
    return [repeatNamesArr.length > 0, repeatNamesArr];
}

async function checkWordsExistInDB(reqBodyData: Service.wordsFormat): Promise<[boolean, Array<string>]> {
    const namesArr = reqBodyData.data.map(value => value.name);
    const result = await Model.Lang.readWordsInName(namesArr);
    const repeatNamesArr = result.map(v => v.name);
    return [result.length > 0, repeatNamesArr];
}

async function checkWordsNotExistInDB(reqBodyData: Service.wordsFormat | { data: Array<string> }): Promise<[boolean, Array<string>]> {
    // @ts-ignore
    const namesArr = reqBodyData.data.map(value => value.name ?? value);
    const result = await Model.Lang.readWordsInName(namesArr);
    const repeatNamesArr = result.map(v => v.name);
    const wordNotInDB = namesArr.filter(v => !repeatNamesArr.includes(v));
    return [wordNotInDB.length > 0, wordNotInDB];
}

async function removeRepeatWordsFromReqBodyData(reqBodyData: Service.wordsFormat, repeatData: any[]): Promise<boolean> {
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

async function insertWordsIntoDB(reqBodyData: Service.wordsFormat): Promise<boolean> {
    const { data } = reqBodyData;
    try {
        await Model.Lang.insertWords(data);
        return false;
    } catch (error) {
        return true;
    }
}

async function updateWordsIntoDB(reqBodyData: Service.wordsFormat): Promise<boolean> {
    const { data } = reqBodyData;
    try {
        await Model.Lang.updateWords(data);
        return false;
    } catch (error) {
        return true;
    }
}

// 返回錯誤 採 go 概念
async function deleteWordsFromDB(reqBodyData: {data: Array<string>}): Promise<boolean> {
    const { data } = reqBodyData;
    try {
        const { deletedCount } = await Model.Lang.deleteWords(data);
        return !(deletedCount === data.length);
    } catch (error) {
        return false;
    }

}

async function deleteLangFromDB(reqBodyData: { lang: string; }): Promise<boolean> {
    const { lang } = reqBodyData;
    try {
        await Model.Lang.deleteLang(lang);
        return false;
    } catch (error) {
        return true;
    }
}



export default {
    TEST,
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
    deleteLangFromDB
};
