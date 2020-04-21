import ErrorPackage from '../../../package/e';
import Validator from 'express-validator';
import util from '../util';
import Model from '../model';

async function checkUserExist(data) {
    const { result } = await util.getDataFromModel(Model.User.findUser, data);
    return !!result;
}

async function createUserData(data) {
    const { result } = await util.getDataFromModel(Model.User.createUser, data);
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

export default { checkUserExist, createUserData, loginValidation, registerValidation }
