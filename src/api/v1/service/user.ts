import Validator = require('express-validator');
import Bcrypt = require('bcrypt');

import ErrorPackage from '../../../package/e';
import Util from '../util';
import Model from '../model';
import { UserModelType } from '../model/model';

async function checkUserExist(data) {
    const { result } = await Util.getDataFromModel(Model.User.countUsers, data);
    console.log("checkUserExist", result);
    return result;
}

async function createUserData(data) {
    const { result } = await Util.getDataFromModel(Model.User.createUser, data);
    return !!result;
}

async function fetchUserData(data: { account: string; }): Promise<[boolean, UserModelType.User|number]> {
    const isError = true;
    try {
        const result = await Model.User.findUser(data);
        if (result) {
            const userData = <UserModelType.User>result.toJSON();
            return [!isError, userData];
        }
        return [isError, ErrorPackage.HttpStatus.ERROR_NOT_EXIST_USER];
    } catch (error) {
        return [isError, ErrorPackage.HttpStatus.INTERNAL_SERVER_ERROR];
    }

}

function hashPassword(reqBodyData: {password: string} ): [boolean, number] {
    const saltRounds = 10;
    try {
        const hash = Bcrypt.hashSync(reqBodyData.password, saltRounds);
        reqBodyData.password = hash;
        return [false, ErrorPackage.HttpStatus.OK];
    } catch (error) {
        return [true, ErrorPackage.HttpStatus.INTERNAL_SERVER_ERROR];
    }
}

function compareHashPassword(reqBodyData: { password: string; }, passwordFromDB: string): [boolean, number] {
    try {
        const isCorrect = Bcrypt.compareSync(reqBodyData.password, passwordFromDB);
        return [!isCorrect, ErrorPackage.HttpStatus.ERROR_PASSWORD]
    } catch (error) {
        return [true, ErrorPackage.HttpStatus.INTERNAL_SERVER_ERROR];
    }
}

async function loginValidation(req): Promise<[boolean, number]>  {
    await accountValidation(req);
    await passwordValidation(req);

    const [err, result] = await Util.validationErrorHandler(req);
    return validationErrorResponse(err, result);
}

async function registerValidation(req): Promise<[boolean, number]> {
    await accountValidation(req);
    await passwordValidation(req);
    await nicknameValidation(req);
    const [err, result] = await Util.validationErrorHandler(req);
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
                errorCode = ErrorPackage.HttpStatus.ERROR_ALREADY_EXIST_LANGUAGE
                break;
            case 'password':
                errorCode = ErrorPackage.HttpStatus.ERROR_ALREADY_EXIST_LANGUAGE;
                break;
            case 'nickname':
                errorCode = ErrorPackage.HttpStatus.ERROR_ALREADY_EXIST_LANGUAGE
                break;
            default:
                errorCode = 500;
                break;
        }
        return [err, errorCode]
    }
    return [false, ErrorPackage.HttpStatus.OK];
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
