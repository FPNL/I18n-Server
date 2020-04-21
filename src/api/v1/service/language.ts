import Validator from 'express-validator';
// import { language: LangModel } from'../model';
import Express from 'express';
import Model from'../model';
import Util from'../util';

async function getLangList(reqBodyData?: any): Promise<Array<string>> {
    const result: any = await Model.Lang.readLanguageList();
    return result.langs;
}

// async function wordValidation(req) {
//     const wordCheck = Validator.check('name').isAlphanumeric();
//     await wordCheck(req, null, () => {} );
//     return Util.validationErrorHandler(req);
// }

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

// async function checkWordExist(reqBodyData) {
//     const [ result ] = await Model.Lang.readWordExist(reqBodyData);
//     return !!Object.values(result)[0];
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
// async function checkWordsDataMatchLangColumn(reqBodyData) {
//     const reqKeys = Object.keys(reqBodyData);

//     const [ result ] = await Model.Lang.readLanguageList();
//     const dbColumns = result.COLUMN_NAME.split(',');

//     return reqKeys.every(column => dbColumns.includes(column));
// }

// async function insertWordIntoDB(reqBodyData) {
//     const [ dataId ] = await Model.Lang.insertWord(reqBodyData);
//     return dataId;
// }

// // TODO 多重
// async function insertWordsIntoDB(reqBodyData) {
//     const [ dataId ] = await Model.Lang.insertWord(reqBodyData);
//     return dataId;
// }

// async function getLimitWordsData(reqParam) {
//     const result = await Model.Lang.readWordData(reqParam);
//     result.forEach(data => delete data.id);
//     return result;
// }

// async function addOneLangColumnToDB(reqBodyData) {
//     return await Model.Lang.createLanguageColumn(reqBodyData);
// }

// async function checkLangColumnValidation(req) {

//     const langColumnCheck = Validator.check('lang').custom(value => !!value.match(/^[\w\-]+$/));
//     await langColumnCheck(req, null, () => {} );
//     return Util.validationErrorHandler(req);
// }
// async function checkLangColumnRepeat(reqBodyData) {
//     const [result] = await Model.Lang.readLanguageList();
//     const columnNames = result.COLUMN_NAME.split(',');
//     const columnNamesArr = result.COLUMN_NAME.split(',').filter(columnName => columnName !== 'name');
//     const ifLangHadRepeat = columnNamesArr.some(value => value === reqBodyData.lang);
//     return ifLangHadRepeat;
// }
export default {
    getLangList,
    // wordValidation,
    // checkWordExist,
    // insertWordIntoDB,
    // checkWordDataMatchLangColumn,
    // getLimitWordsData,
    // addOneLangColumnToDB,
    // checkLangColumnValidation,
    // checkLangColumnRepeat
};
