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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.langPath = void 0;
const express_1 = __importDefault(require("express"));
const langController = __importStar(require("../controller/language"));
const util_1 = require("../util");
const httpStatus_1 = require("../../../package/httpStatus");
const router = express_1.default.Router();
exports.langPath = {
    LangList: '/list',
    WordsContent: '/content',
    LangAdd: '/addLanguage',
    WordsAdd: '/addWords',
    WordsAlter: '/alterWords',
    LangDelete: '/deleteLanguage',
    WordsDelete: '/deleteWords',
    NativeLangGet: '/nativeLang',
    NativeLangUpdate: '/alterNativeLang'
};
router.get(exports.langPath.LangList, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let responseData = yield langController.r_getLangListHandler();
    if (responseData.status === httpStatus_1.HttpStatus.WARNING_NOT_EXIST_KEY) {
        responseData = yield langController.getLanguageListHandler();
    }
    util_1.routerResponseFormatter(res, responseData);
}));
router.get(exports.langPath.WordsContent, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const responseData = yield langController.getWordsContentHandler(req);
    util_1.routerResponseFormatter(res, responseData);
}), (req, res) => {
});
router.post(exports.langPath.LangAdd, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const responseData = yield langController.addLanguageHandler(req);
    util_1.routerResponseFormatter(res, responseData);
}));
router.post(exports.langPath.WordsAdd, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const responseData = yield langController.addWordsHandler(req);
    util_1.routerResponseFormatter(res, responseData);
}), (req, res) => {
});
router.put(exports.langPath.WordsAlter, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const responseData = yield langController.alterWordsHandler(req);
    util_1.routerResponseFormatter(res, responseData);
}));
router.delete(exports.langPath.LangDelete, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const responseData = yield langController.deleteLangHandler(req);
    util_1.routerResponseFormatter(res, responseData);
}));
router.delete(exports.langPath.WordsDelete, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const responseData = yield langController.deleteWordsHandler(req);
    util_1.routerResponseFormatter(res, responseData);
}), (req, res) => {
});
router.get(exports.langPath.NativeLangGet, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let responseData = yield langController.r_getNativeLangHandler();
    if (responseData.status === httpStatus_1.HttpStatus.WARNING_NOT_EXIST_KEY) {
        responseData = yield langController.getNativeLanguage();
    }
    util_1.routerResponseFormatter(res, responseData);
}));
router.put(exports.langPath.NativeLangUpdate, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const responseData = yield langController.updateNativeLang(req);
    util_1.routerResponseFormatter(res, responseData);
}));
exports.default = router;
