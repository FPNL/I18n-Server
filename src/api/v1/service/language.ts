import Validator = require('express-validator');
import Express = require('express');

// import { language: LangModel } from'../model';
import Model from'../model';
import Util from '../util';
import ErrorPackage from '../../../package/e';
import { Service } from './service';

async function TEST(reqBodyData: Service.wordsFormat) {
    const result = await Model.Lang.TEST();
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
    return [false, ErrorPackage.HttpStatus.OK];
}

async function checkLangColumnRepeat(reqBodyData: { lang: string }): Promise<boolean|undefined> {
    const result = await Model.Lang.readLanguageList();
    const ifLangHadRepeat = result?.langs.some(value => value === reqBodyData.lang);
    return ifLangHadRepeat;
}

async function addOneLangColumnToDB(reqBodyData: { lang: string; }) {
    return await Model.Lang.createLanguageColumn(reqBodyData);
}

async function checkWordsValidation(req: Express.Request): Promise<[boolean, number]> {
    const namesCheck = Validator.check('data.*.name').isAlphanumeric();
    const contentCheck = Validator.check('data.*.content').custom((value: Service.wordContent): boolean => {
        for (const lang in value) {
            if (value.hasOwnProperty(lang) && !lang.match(/^[\w\-]+$/)) {
                throw new Error(`data.content 的 ${lang} 錯誤，須為 "a-Z", "0-9", "-", "_"`);
            }
        }
        return true;
    });

    await namesCheck(req, null, () => { });
    await contentCheck(req, null, () => { });
    const [err, result] = await Util.validationErrorHandler(req);
    if (err) {
        let errorCode = 500;
        if (result.includes('.name')) {
            errorCode = ErrorPackage.HttpStatus.ERROR_NAME_FORMAT;
        } else if (result.includes('.content')) {
            errorCode = ErrorPackage.HttpStatus.ERROR_CONTENT_FORMAT;
        }
        return [err, errorCode];
    }
    return [false, ErrorPackage.HttpStatus.OK]
}

async function checkWordsDataMatchLangColumn(reqBodyData: Service.wordsFormat): Promise<boolean> {
    // 時間複雜度 O(n*m)
    // n = content.length * data.length;
    // m = langs.length;

    const result = await Model.Lang.readLanguageList();

    if (result && result.langs) {
        const { langs } = result;
        return reqBodyData.data.every(value => {
            const reqKeys = Object.keys(value.content);
            return reqKeys.every(column => langs.includes(column));
        });
    }
    return false;
}

async function checkWordsRepeat(reqBodyData: Service.wordsFormat): Promise<[boolean, Array<any>]> {
    const namesArr = reqBodyData.data.map(value => value.name);
    const result = await Model.Lang.readWordsRepeat(namesArr);
    return [result.length > 0, result];
}


// // TODO 多重
// async function wordsValidation(req) {
//     // reqBodyData should be Array,
//     // data would be [{name: ""}, {name: ""}, ...] or ["name1", "name2", ...],
//     const wordsCheck = Validator.check('data').custom(eachData => {
//         // return (eachData.name || eachData) isAlphanumeric();
//     });
//     await wordsCheck(req, null, () => { });
//     return Util.validationErrorHandler(req);
// }


// // TODO 多重
// async function checkWordsExist(reqBodyData) {
//     // reqBodyData should be Array,
//     // data would be [{name: ""}, {name: ""}, ...] or ["name1", "name2", ...],

//     // 只要數 select where in 的數量跟 array 的數量有沒有符合
//     // SELECT COUNT(name)
//     // FROM languages
//     // WHERE name IN ('test1','test2','test3');
//     const [result] = await Model.Lang.readWordExist();
// }



// async function checkWordDataMatchLangColumn(reqBodyData) {
//     const reqKeys = Object.keys(reqBodyData);

//     const [ result ] = await Model.Lang.readLanguageList();
//     const dbColumns = result.COLUMN_NAME.split(',');

//     return reqKeys.every(column => dbColumns.includes(column));
// }

// // TODO 多重

// async function insertWordIntoDB(reqBodyData) {
//     const [ dataId ] = await Model.Lang.insertWord(reqBodyData);
//     return dataId;
// }

// // TODO 多重
// async function insertWordsIntoDB(reqBodyData) {
//     const [ dataId ] = await Model.Lang.insertWord(reqBodyData);
//     return dataId;
// }




export default {
    getLangList,
    getLimitWordsData,
    checkLangColumnValidation,
    checkLangColumnRepeat,
    addOneLangColumnToDB,
    checkWordsValidation,
    checkWordsDataMatchLangColumn,
    checkWordsRepeat,
    TEST,
    // insertWordIntoDB,
    // checkWordDataMatchLangColumn,
};
