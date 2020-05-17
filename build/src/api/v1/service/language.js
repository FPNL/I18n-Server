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
exports.updateNativeLang = exports.getNativeLanguage = exports.getNativeLangFromRedis = exports.checkKeyExistFromRedis = exports.setNativeLangIntoRedis = exports.removeLangListFromRedis = exports.getLangListFromRedis = exports.setLangListIntoRedis = exports.deleteLangFromDB = exports.deleteWordsFromDB = exports.checkNameValidation = exports.updateWordsIntoDB = exports.insertWordsIntoDB = exports.removeRepeatWordsFromReqBodyData = exports.checkWordsNotExistInDB = exports.checkWordsExistInDB = exports.checkRepeatInsideReqBodyData = exports.checkWordsDataMatchLangs = exports.checkWordsValidation = exports.addOneLangToDB = exports.checkLangHasExist = exports.checkLangColumnValidation = exports.getLimitWordsData = exports.getLangList = void 0;
const Validator = __importStar(require("express-validator"));
const langModel = __importStar(require("../model/language"));
const util = __importStar(require("../util"));
const httpStatus_1 = require("../../../package/httpStatus");
function setNativeLangIntoRedis(reqBodyData) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield langModel.r_setNativeLang(reqBodyData.lang);
    });
}
exports.setNativeLangIntoRedis = setNativeLangIntoRedis;
function getNativeLangFromRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield langModel.r_getNativeLang();
    });
}
exports.getNativeLangFromRedis = getNativeLangFromRedis;
function setLangListIntoRedis(reqBodyData) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield langModel.r_setLangSet(reqBodyData.lang);
        return result;
    });
}
exports.setLangListIntoRedis = setLangListIntoRedis;
function getLangListFromRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield langModel.r_getLangSet();
        return result;
    });
}
exports.getLangListFromRedis = getLangListFromRedis;
function removeLangListFromRedis(reqBodyData) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield langModel.r_removeLangSet(reqBodyData.lang);
        return result;
    });
}
exports.removeLangListFromRedis = removeLangListFromRedis;
function getLangList(reqBodyData) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield langModel.readLanguageList();
        return result === null || result === void 0 ? void 0 : result.langs;
    });
}
exports.getLangList = getLangList;
function getLimitWordsData(reqParam) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const params = { limit: parseInt((_a = reqParam.limit) !== null && _a !== void 0 ? _a : '50'), skip: parseInt((_b = reqParam.page) !== null && _b !== void 0 ? _b : '0') };
        return yield langModel.readWordsData(null, params);
    });
}
exports.getLimitWordsData = getLimitWordsData;
function checkLangColumnValidation(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const langColumnCheck = Validator.check('lang').custom(value => !!value.match(/^[\w\-]+$/));
        yield langColumnCheck(req, null, () => { });
        const [err, result] = yield util.validationErrorHandler(req);
        if (err) {
            return [err, httpStatus_1.HttpStatus.ERROR_LANG_COLUMN_FORMAT];
        }
        return [err, httpStatus_1.HttpStatus.OK];
    });
}
exports.checkLangColumnValidation = checkLangColumnValidation;
function checkLangHasExist(reqBodyData, langList) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!langList) {
            const dbData = yield langModel.readLanguageList();
            langList = dbData === null || dbData === void 0 ? void 0 : dbData.langs;
        }
        const ifLangHasExisted = langList === null || langList === void 0 ? void 0 : langList.some(value => value === reqBodyData.lang);
        return ifLangHasExisted;
    });
}
exports.checkLangHasExist = checkLangHasExist;
function addOneLangToDB(reqBodyData) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield langModel.updateLanguageByPushing(reqBodyData);
    });
}
exports.addOneLangToDB = addOneLangToDB;
function checkNameValidation(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const namesCheck = Validator.check('data.*').isAlphanumeric();
        yield namesCheck(req, null, () => { });
        const [err, result] = yield util.validationErrorHandler(req);
        if (err) {
            return [err, httpStatus_1.HttpStatus.ERROR_NAME_FORMAT];
        }
        return [err, httpStatus_1.HttpStatus.OK];
    });
}
exports.checkNameValidation = checkNameValidation;
function checkWordsValidation(req) {
    return __awaiter(this, void 0, void 0, function* () {
        let errorCode = httpStatus_1.HttpStatus.OK;
        const dataCheck = Validator.body('data').isArray({ min: 1 });
        const namesCheck = Validator.body('data.*.name').isAlphanumeric();
        const contentCheck = Validator.body('data.*.content').custom((content) => {
            if (content) {
                for (const lang in content) {
                    if (content.hasOwnProperty(lang) && !lang.match(/^[\w\-]+$/)) {
                        throw new Error(`data.content 的 ${lang} 錯誤，須為 "a-Z", "0-9", "-", "_"`);
                    }
                }
            }
            else {
                errorCode = httpStatus_1.HttpStatus.ERROR_DATA_FORMAT;
            }
            return true;
        });
        yield dataCheck(req, null, () => { });
        yield namesCheck(req, null, () => { });
        yield contentCheck(req, null, () => { });
        const [err, result] = yield util.validationErrorHandler(req);
        if (err) {
            if (result.includes('.name')) {
                errorCode = httpStatus_1.HttpStatus.ERROR_NAME_FORMAT;
            }
            else if (result.includes('.content')) {
                errorCode = httpStatus_1.HttpStatus.ERROR_CONTENT_FORMAT;
            }
            else if (result === 'data') {
                errorCode = httpStatus_1.HttpStatus.ERROR_DATA_FORMAT;
            }
            return [err, errorCode];
        }
        return [false, errorCode];
    });
}
exports.checkWordsValidation = checkWordsValidation;
function checkWordsDataMatchLangs(reqBodyData) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield langModel.readLanguageList();
        if (result && result.langs) {
            const { langs } = result;
            let notMatchedData = "";
            const everyDataMatched = reqBodyData.data.every(eachData => {
                if (!eachData.hasOwnProperty("content") || !eachData.content) {
                    eachData.content = {};
                    return true;
                }
                const reqKeys = Object.keys(eachData.content);
                notMatchedData = reqKeys.find(column => !langs.includes(column));
                console.log(133, notMatchedData);
                return !notMatchedData;
            });
            return [!everyDataMatched, notMatchedData !== null && notMatchedData !== void 0 ? notMatchedData : ""];
        }
        return [true, '尚未建立語言'];
    });
}
exports.checkWordsDataMatchLangs = checkWordsDataMatchLangs;
function checkRepeatInsideReqBodyData(reqBodyData) {
    const namesArr = reqBodyData.data.map(value => value.name);
    const findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) !== index);
    const repeatNamesArr = [...new Set(findDuplicates(namesArr))];
    return [repeatNamesArr.length > 0, repeatNamesArr];
}
exports.checkRepeatInsideReqBodyData = checkRepeatInsideReqBodyData;
function checkWordsExistInDB(reqBodyData) {
    return __awaiter(this, void 0, void 0, function* () {
        const namesArr = reqBodyData.data.map(value => value.name);
        const result = yield langModel.readWordsInName(namesArr);
        const repeatNamesArr = result.map(v => v.name);
        return [result.length > 0, repeatNamesArr];
    });
}
exports.checkWordsExistInDB = checkWordsExistInDB;
function checkWordsNotExistInDB(reqBodyData) {
    return __awaiter(this, void 0, void 0, function* () {
        const namesArr = reqBodyData.data.map(value => { var _a; return (_a = value.name) !== null && _a !== void 0 ? _a : value; });
        const result = yield langModel.readWordsInName(namesArr);
        console.log(123, result);
        const repeatNamesArr = result.map(v => v.name);
        const wordNotInDB = namesArr.filter(v => !repeatNamesArr.includes(v));
        return [wordNotInDB.length > 0, wordNotInDB];
    });
}
exports.checkWordsNotExistInDB = checkWordsNotExistInDB;
function removeRepeatWordsFromReqBodyData(reqBodyData, repeatData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            reqBodyData.data = reqBodyData.data.filter(value => {
                const isNameRepeat = repeatData.some(val => val.name === value.name);
                return !isNameRepeat;
            });
            return false;
        }
        catch (error) {
            return true;
        }
    });
}
exports.removeRepeatWordsFromReqBodyData = removeRepeatWordsFromReqBodyData;
function insertWordsIntoDB(reqBodyData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = reqBodyData;
        try {
            yield langModel.insertWords(data);
            return false;
        }
        catch (error) {
            return true;
        }
    });
}
exports.insertWordsIntoDB = insertWordsIntoDB;
function updateWordsIntoDB(reqBodyData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = reqBodyData;
        try {
            yield langModel.updateWords(data);
            return false;
        }
        catch (error) {
            return true;
        }
    });
}
exports.updateWordsIntoDB = updateWordsIntoDB;
function deleteWordsFromDB(reqBodyData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = reqBodyData;
        try {
            const { deletedCount } = yield langModel.deleteWords(data);
            return !(deletedCount === data.length);
        }
        catch (error) {
            return false;
        }
    });
}
exports.deleteWordsFromDB = deleteWordsFromDB;
function deleteLangFromDB(reqBodyData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { lang } = reqBodyData;
        try {
            yield langModel.deleteLang(lang);
            return false;
        }
        catch (error) {
            return true;
        }
    });
}
exports.deleteLangFromDB = deleteLangFromDB;
function checkKeyExistFromRedis(keyName) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield langModel.r_getKeyExist(keyName);
    });
}
exports.checkKeyExistFromRedis = checkKeyExistFromRedis;
function getNativeLanguage() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield langModel.readNativeLang();
        return result === null || result === void 0 ? void 0 : result.nativeLang;
    });
}
exports.getNativeLanguage = getNativeLanguage;
function updateNativeLang(reqBodyData) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield langModel.updateNativeLang(reqBodyData.lang);
    });
}
exports.updateNativeLang = updateNativeLang;
