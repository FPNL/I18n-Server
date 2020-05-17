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
exports.r_getNativeLangHandler = exports.r_getLangListHandler = exports.getNativeLanguage = exports.updateNativeLang = exports.deleteLangHandler = exports.deleteWordsHandler = exports.alterWordsHandler = exports.addWordsHandler = exports.addLanguageHandler = exports.getWordsContentHandler = exports.getLanguageListHandler = void 0;
const httpStatus_1 = require("../../../package/httpStatus");
const langService = __importStar(require("../service/language"));
function getLanguageListHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield langService.getLangList();
            if (result) {
                return { status: httpStatus_1.HttpStatus.OK, result };
            }
        }
        catch (error) {
            console.error("getLanguageListHandler 錯誤", error);
            return { status: httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
        }
        return { status: httpStatus_1.HttpStatus.NO_DATA, result: false };
    });
}
exports.getLanguageListHandler = getLanguageListHandler;
function r_getLangListHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const keyName = 'langs';
            const hasKey = yield langService.checkKeyExistFromRedis(keyName);
            if (!hasKey) {
                return { status: httpStatus_1.HttpStatus.WARNING_NOT_EXIST_KEY, result: false };
            }
            const result = yield langService.getLangListFromRedis();
            if (result.length) {
                return { status: httpStatus_1.HttpStatus.OK, result };
            }
        }
        catch (error) {
            console.error("getLanguageListHandler 錯誤", error);
            return { status: httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
        }
        return { status: httpStatus_1.HttpStatus.NO_DATA, result: false };
    });
}
exports.r_getLangListHandler = r_getLangListHandler;
function getWordsContentHandler(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const reqParam = req.params;
            const result = yield langService.getLimitWordsData(reqParam);
            if (result) {
                return { status: httpStatus_1.HttpStatus.OK, result };
            }
        }
        catch (error) {
            console.error("createWordsHandler 錯誤", error);
            return { status: httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
        }
        return { status: httpStatus_1.HttpStatus.NO_DATA, result: false };
    });
}
exports.getWordsContentHandler = getWordsContentHandler;
function addLanguageHandler(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const reqBodyData = req.body;
            let [error, validationErrorCode] = yield langService.checkLangColumnValidation(req);
            if (error) {
                return { status: validationErrorCode, result: false };
            }
            if (yield langService.checkLangHasExist(reqBodyData)) {
                return { status: httpStatus_1.HttpStatus.ERROR_ALREADY_EXIST_LANGUAGE, result: false };
            }
            const result = yield langService.addOneLangToDB(reqBodyData);
            if (!result) {
                throw new Error("新增語言至資料庫失敗");
            }
            yield langService.setLangListIntoRedis(reqBodyData);
        }
        catch (error) {
            console.error("addLanguageHandler 錯誤", error);
            return { status: httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
        }
        return { status: httpStatus_1.HttpStatus.OK, result: true };
    });
}
exports.addLanguageHandler = addLanguageHandler;
function addWordsHandler(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const reqBodyData = req.body;
            let [error, validationErrorCode] = yield langService.checkWordsValidation(req);
            if (error) {
                return { status: validationErrorCode, result: false };
            }
            let [errorNotMatch, wrongLang] = yield langService.checkWordsDataMatchLangs(reqBodyData);
            if (errorNotMatch) {
                return { status: httpStatus_1.HttpStatus.ERROR_LANG_COLUMN_OVERFLOW, result: wrongLang };
            }
            const [isInsideDataRepeat, repeatDataInReqBody] = langService.checkRepeatInsideReqBodyData(reqBodyData);
            if (isInsideDataRepeat) {
                return { status: httpStatus_1.HttpStatus.WARNING_REPEAT_WORD, result: repeatDataInReqBody };
            }
            const [hasRepeat, repeatData] = yield langService.checkWordsExistInDB(reqBodyData);
            if (hasRepeat) {
                return { status: httpStatus_1.HttpStatus.WARNING_REPEAT_WORD, result: repeatData };
            }
            error = yield langService.insertWordsIntoDB(reqBodyData);
            if (error) {
                throw httpStatus_1.HttpStatusMessage.get(httpStatus_1.HttpStatus.WARNING_REPEAT_WORD);
            }
        }
        catch (error) {
            console.error("createWordsHandler 錯誤 : ", error);
            return { status: httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
        }
        return { status: httpStatus_1.HttpStatus.OK, result: true };
    });
}
exports.addWordsHandler = addWordsHandler;
function alterWordsHandler(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const reqBodyData = req.body;
            let [error, validationErrorCode] = yield langService.checkWordsValidation(req);
            if (error) {
                return { status: validationErrorCode, result: false };
            }
            const [errorNotMatch, wrongLang] = yield langService.checkWordsDataMatchLangs(reqBodyData);
            if (errorNotMatch) {
                return { status: httpStatus_1.HttpStatus.ERROR_LANG_COLUMN_OVERFLOW, result: wrongLang };
            }
            const [isInsideDataRepeat, repeatDataInReqBody] = langService.checkRepeatInsideReqBodyData(reqBodyData);
            if (isInsideDataRepeat) {
                return { status: httpStatus_1.HttpStatus.WARNING_REPEAT_WORD, result: repeatDataInReqBody };
            }
            const [isNotExist, ghostData] = yield langService.checkWordsNotExistInDB(reqBodyData);
            if (isNotExist) {
                return { status: httpStatus_1.HttpStatus.ERROR_NOT_EXIST_WORD, result: ghostData };
            }
            error = yield langService.updateWordsIntoDB(reqBodyData);
            if (error) {
                throw httpStatus_1.HttpStatusMessage.get(httpStatus_1.HttpStatus.WARNING_REPEAT_WORD);
            }
        }
        catch (error) {
            console.error("alterWordsHandler 錯誤 : ", error);
            return { status: httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
        }
        return { status: httpStatus_1.HttpStatus.OK, result: true };
    });
}
exports.alterWordsHandler = alterWordsHandler;
function deleteWordsHandler(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const reqBodyData = req.body;
            let [error, validationErrorCode] = yield langService.checkNameValidation(req);
            if (error) {
                return { status: validationErrorCode, result: false };
            }
            const [isNotExist, ghostData] = yield langService.checkWordsNotExistInDB(reqBodyData);
            if (isNotExist) {
                return { status: httpStatus_1.HttpStatus.ERROR_NOT_EXIST_WORD, result: ghostData };
            }
            error = yield langService.deleteWordsFromDB(reqBodyData);
            if (error) {
                throw httpStatus_1.HttpStatusMessage.get(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        catch (error) {
            console.error("deleteWordsHandler 錯誤 : ", error);
            return { status: httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
        }
        return { status: httpStatus_1.HttpStatus.OK, result: true };
    });
}
exports.deleteWordsHandler = deleteWordsHandler;
function deleteLangHandler(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const reqBodyData = req.body;
            let [error, validationErrorCode] = yield langService.checkLangColumnValidation(req);
            if (error) {
                return { status: validationErrorCode, result: false };
            }
            const langList = yield langService.getLangList();
            if (!langList) {
                return { status: httpStatus_1.HttpStatus.ERROR_NOT_EXIST_LANGUAGE, result: false };
            }
            else if (langList.length === 1) {
                return { status: httpStatus_1.HttpStatus.WARNING_LANG_AT_LEAST_ONE, result: false };
            }
            if (!(yield langService.checkLangHasExist(reqBodyData, langList))) {
                return { status: httpStatus_1.HttpStatus.ERROR_NOT_EXIST_LANGUAGE, result: false };
            }
            error = yield langService.deleteLangFromDB(reqBodyData);
            if (error) {
                throw httpStatus_1.HttpStatusMessage.get(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            yield langService.removeLangListFromRedis(reqBodyData);
        }
        catch (error) {
            console.error("deleteLangHandler 錯誤 : ", error);
            return { status: httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
        }
        return { status: httpStatus_1.HttpStatus.OK, result: true };
    });
}
exports.deleteLangHandler = deleteLangHandler;
function getNativeLanguage() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentLang = yield langService.getNativeLanguage();
            if (!currentLang) {
                return { status: httpStatus_1.HttpStatus.ERROR_NOT_EXIST_LANGUAGE, result: false };
            }
            yield langService.setNativeLangIntoRedis({ lang: currentLang });
            return { status: httpStatus_1.HttpStatus.OK, result: currentLang };
        }
        catch (error) {
            console.error("deleteLangHandler 錯誤 : ", error);
            return { status: httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
        }
    });
}
exports.getNativeLanguage = getNativeLanguage;
function updateNativeLang(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const reqBodyData = req.body;
            let [error, validationErrorCode] = yield langService.checkLangColumnValidation(req);
            if (error) {
                return { status: validationErrorCode, result: false };
            }
            if (!(yield langService.checkLangHasExist(reqBodyData))) {
                return { status: httpStatus_1.HttpStatus.ERROR_NOT_EXIST_LANGUAGE, result: false };
            }
            const currentLang = yield langService.getNativeLanguage();
            if (currentLang === reqBodyData.lang) {
                return { status: httpStatus_1.HttpStatus.OK, result: true };
            }
            yield langService.updateNativeLang(reqBodyData);
            yield langService.setNativeLangIntoRedis(reqBodyData);
        }
        catch (error) {
            console.error("updateNativeLang 錯誤 : ", error);
            return { status: httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
        }
        return { status: httpStatus_1.HttpStatus.OK, result: true };
    });
}
exports.updateNativeLang = updateNativeLang;
function r_getNativeLangHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const keyName = 'nativeLang';
            const hasKey = yield langService.checkKeyExistFromRedis(keyName);
            if (!hasKey) {
                return { status: httpStatus_1.HttpStatus.WARNING_NOT_EXIST_KEY, result: false };
            }
            const result = yield langService.getNativeLangFromRedis();
            if (result) {
                return { status: httpStatus_1.HttpStatus.OK, result };
            }
        }
        catch (error) {
            console.error("r_getNativeLangHandler 錯誤", error);
            return { status: httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
        }
        return { status: httpStatus_1.HttpStatus.NO_DATA, result: false };
    });
}
exports.r_getNativeLangHandler = r_getNativeLangHandler;
