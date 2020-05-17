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
exports.validationErrorHandler = exports.routerResponseFormatter = void 0;
const Validator = __importStar(require("express-validator"));
const httpStatus_1 = require("../../../package/httpStatus");
function routerResponseFormatter(res, responseData) {
    const message = httpStatus_1.HttpStatusMessage.get(responseData.status);
    if (responseData.status > 600) {
        responseData.status = 400;
    }
    res
        .status(responseData.status)
        .json({ result: responseData.result, message });
}
exports.routerResponseFormatter = routerResponseFormatter;
function validationErrorHandler(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = yield Validator.validationResult(req);
        let result = '';
        const isError = !errors.isEmpty();
        if (isError) {
            console.log("資料驗證錯誤", errors);
            result = Object.keys(errors.mapped())[0];
        }
        return [isError, result];
    });
}
exports.validationErrorHandler = validationErrorHandler;
