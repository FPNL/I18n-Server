const { HttpStatus, HttpStatusMessage } = require('../../../package/e');
const Validator = require('express-validator');

const {user: UserModel} = require('../model');

async function getDataFromModel(modelFn, data) {
    try {
        return { result: await modelFn(data) };
    } catch (e) {
        console.error(" ＝＝＝ getDataFromModel 錯誤 ＝＝＝")
        let status = HttpStatus.INTERNAL_SERVER_ERROR;

        if (e.name === 'SequelizeValidationError') {
            // TODO 低 紀錄錯誤
        } else if (e.name === 'SequelizeUniqueConstraintError') {
            // TODO 低 紀錄錯誤
        }
            // TODO 低 紀錄錯誤

        throw status;
    }
}

async function checkUserExist(data) {
    const { result } = await getDataFromModel(UserModel.findUser, data);
    return !!result;
}

async function createUserData(data) {
    const { result } = await getDataFromModel(UserModel.createUser, data);
    return !!result;
}

async function loginValidation(req) {
     await accountValidation(req);
     await passwordValidation(req);

    return validationErrorHandler(req);
}

async function registerValidation(req) {
    await accountValidation(req);
    await passwordValidation(req);
    await nicknameValidation(req);

    return validationErrorHandler(req);
}

function accountValidation(req) {
    const accountCheck = Validator.check('account').isEmail();
    return accountCheck( req, null, () => {});
}

function passwordValidation(req) {
    const passwordCheck = Validator.check('password').isLength({min: 0, max: 100}).isAlphanumeric();
    return passwordCheck( req, null, () => {});
}

function nicknameValidation(req) {
    const nicknameCheck = Validator.check('nickname').isLength({min: 0, max: 50}).isAlpha();
    return nicknameCheck(req, null, () => {})
}

async function validationErrorHandler(req) {
    const errors = await Validator.validationResult(req);
    !errors.isEmpty() && console.log("資料驗證錯誤", errors);
    return errors.isEmpty();
}

module.exports = { checkUserExist, createUserData, loginValidation, registerValidation }