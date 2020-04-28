import Validator = require('express-validator');
import Bcrypt = require('bcrypt');

import e from '../../../package/e';
import util from '../util';
import model from '../model';
import config from '../../../config';
import { ModelDeclare } from '../model/model';

async function checkUserExist(data) {
    const { result } = await util.getDataFromModel(model.User.countUsers, data);
    console.log("checkUserExist", result);
    return result;
}

async function createUserData(data) {
    const { result } = await util.getDataFromModel(model.User.createUser, data);
    return !!result;
}

async function fetchUserData(data: { account: string; }): Promise<[boolean, ModelDeclare.User|number]> {
    const isError = true;
    try {
        const result = await model.User.findUser(data);
        if (result) {
            const userData = <ModelDeclare.User>result.toJSON();
            return [!isError, userData];
        }
        return [isError, e.HttpStatus.ERROR_NOT_EXIST_USER];
    } catch (error) {
        return [isError, e.HttpStatus.INTERNAL_SERVER_ERROR];
    }

}

function hashPassword(reqBodyData: {password: string} ): [boolean, number] {
    const saltRounds = Number(config.BCRYPT_SALT_ROUNDS) || 10;
    try {
        const hash = Bcrypt.hashSync(reqBodyData.password, saltRounds);
        reqBodyData.password = hash;
        return [false, e.HttpStatus.OK];
    } catch (error) {
        return [true, e.HttpStatus.INTERNAL_SERVER_ERROR];
    }
}

function compareHashPassword(reqBodyData: { password: string; }, passwordFromDB: string): [boolean, number] {
    try {
        const isCorrect = Bcrypt.compareSync(reqBodyData.password, passwordFromDB);
        return [!isCorrect, e.HttpStatus.ERROR_PASSWORD]
    } catch (error) {
        return [true, e.HttpStatus.INTERNAL_SERVER_ERROR];
    }
}

async function loginValidation(req): Promise<[boolean, number]>  {
    await accountValidation(req);
    await passwordValidation(req);

    const [err, result] = await util.validationErrorHandler(req);
    return validationErrorResponse(err, result);
}

async function registerValidation(req): Promise<[boolean, number]> {
    await accountValidation(req);
    await passwordValidation(req);
    await nicknameValidation(req);
    const [err, result] = await util.validationErrorHandler(req);
    return validationErrorResponse(err, result);
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

function validationErrorResponse(err: boolean, result: string): [boolean, number] {
    if (err) {
        let errorCode: number;
        switch (result) {
            case 'account':
                errorCode = e.HttpStatus.ERROR_ALREADY_EXIST_LANGUAGE
                break;
            case 'password':
                errorCode = e.HttpStatus.ERROR_ALREADY_EXIST_LANGUAGE;
                break;
            case 'nickname':
                errorCode = e.HttpStatus.ERROR_ALREADY_EXIST_LANGUAGE
                break;
            default:
                errorCode = 500;
                break;
        }
        return [err, errorCode]
    }
    return [false, e.HttpStatus.OK];
}

export default {
    checkUserExist,
    createUserData,
    fetchUserData,
    loginValidation,
    registerValidation,
    hashPassword,
    compareHashPassword
}
