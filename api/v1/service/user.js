const { HttpStatus, HttpStatusMessage } = require('../../../package/e');
const Validator = require('express-validator');
const util = require('../util');
const {user: UserModel} = require('../model');

async function checkUserExist(data) {
    const { result } = await util.getDataFromModel(UserModel.findUser, data);
    return !!result;
}

async function createUserData(data) {
    const { result } = await util.getDataFromModel(UserModel.createUser, data);
    return !!result;
}

async function loginValidation(req) {
     await accountValidation(req);
     await passwordValidation(req);

    return util.validationErrorHandler(req);
}

async function registerValidation(req) {
    await accountValidation(req);
    await passwordValidation(req);
    await nicknameValidation(req);

    return util.validationErrorHandler(req);
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


module.exports = { checkUserExist, createUserData, loginValidation, registerValidation }