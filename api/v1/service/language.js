const Validator = require('express-validator');
const { language: LangModel } = require('../model');
const util = require('../util');

async function wordValidation(req) {
    const wordCheck = Validator.check('name').isAlphanumeric();
    await wordCheck(req, null, () => {} );
    return util.validationErrorHandler(req);
}

async function checkWordExist(reqData) {
    const [ result ] = await LangModel.readWordExist(reqData);
    return !!Object.values(result)[0];
}

async function checkLanguageColumnIncludeReqData(reqData) {
    const reqKeys = Object.keys(reqData);

    const result = await LangModel.readLanguageList();
    const dbColumns = result.map(columnName => columnName.COLUMN_NAME );
    console.log(dbColumns, reqKeys);

    return reqKeys.every(column => dbColumns.includes(column));
}

async function insertWordIntoDB(reqData) {
    const [ dataId ] = await LangModel.insertWord(reqData);
    return dataId;
}

module.exports = {
    wordValidation,
    checkWordExist,
    insertWordIntoDB,
    checkLanguageColumnIncludeReqData
};
