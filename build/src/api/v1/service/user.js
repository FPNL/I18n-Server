"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareHashPassword = exports.hashPassword = exports.registerValidation = exports.loginValidation = exports.fetchUserData = exports.createUserData = exports.checkUserExist = void 0;
const Validator = __importStar(require("express-validator"));
const Bcrypt = __importStar(require("bcrypt"));
const httpStatus_1 = require("../../../package/httpStatus");
const util = __importStar(require("../util"));
const userModel = __importStar(require("../model/user"));
const config = __importStar(require("../../../config"));
function checkUserExist(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield userModel.countUsers(data);
        return result;
    });
}
exports.checkUserExist = checkUserExist;
function createUserData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield userModel.createUser(data);
        return !!result;
    });
}
exports.createUserData = createUserData;
function fetchUserData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const isError = true;
        try {
            const result = yield userModel.findUser(data);
            if (result) {
                const userData = result.toJSON();
                return [!isError, userData];
            }
            return [isError, httpStatus_1.HttpStatus.ERROR_NOT_EXIST_USER];
        }
        catch (error) {
            return [isError, httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR];
        }
    });
}
exports.fetchUserData = fetchUserData;
function hashPassword(reqBodyData) {
    const saltRounds = Number(config.BCRYPT_SALT_ROUNDS) || 10;
    try {
        const hash = Bcrypt.hashSync(reqBodyData.password, saltRounds);
        reqBodyData.password = hash;
        return [false, httpStatus_1.HttpStatus.OK];
    }
    catch (error) {
        return [true, httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR];
    }
}
exports.hashPassword = hashPassword;
function compareHashPassword(reqBodyData, passwordFromDB) {
    try {
        const isCorrect = Bcrypt.compareSync(reqBodyData.password, passwordFromDB);
        return [!isCorrect, httpStatus_1.HttpStatus.ERROR_PASSWORD];
    }
    catch (error) {
        return [true, httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR];
    }
}
exports.compareHashPassword = compareHashPassword;
function loginValidation(req) {
    return __awaiter(this, void 0, void 0, function* () {
        yield accountValidation(req);
        yield passwordValidation(req);
        const [err, result] = yield util.validationErrorHandler(req);
        return validationErrorResponse(err, result);
    });
}
exports.loginValidation = loginValidation;
function registerValidation(req) {
    return __awaiter(this, void 0, void 0, function* () {
        yield accountValidation(req);
        yield passwordValidation(req);
        yield nicknameValidation(req);
        const [err, result] = yield util.validationErrorHandler(req);
        return validationErrorResponse(err, result);
    });
}
exports.registerValidation = registerValidation;
function accountValidation(req) {
    const accountCheck = Validator.check('account').isEmail();
    return accountCheck(req, null, () => { });
}
function passwordValidation(req) {
    const passwordCheck = Validator.check('password').isLength({ min: 0, max: 100 }).isAlphanumeric();
    return passwordCheck(req, null, () => { });
}
function nicknameValidation(req) {
    const nicknameCheck = Validator.check('nickname').isLength({ min: 0, max: 50 }).isAlpha();
    return nicknameCheck(req, null, () => { });
}
function validationErrorResponse(err, result) {
    if (err) {
        let errorCode;
        switch (result) {
            case 'account':
                errorCode = httpStatus_1.HttpStatus.ERROR_ALREADY_EXIST_LANGUAGE;
                break;
            case 'password':
                errorCode = httpStatus_1.HttpStatus.ERROR_ALREADY_EXIST_LANGUAGE;
                break;
            case 'nickname':
                errorCode = httpStatus_1.HttpStatus.ERROR_ALREADY_EXIST_LANGUAGE;
                break;
            default:
                errorCode = 500;
                break;
        }
        return [err, errorCode];
    }
    return [false, httpStatus_1.HttpStatus.OK];
}
