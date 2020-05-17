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
exports.customPassportAuth = exports.registerHandler = exports.loginHandler = void 0;
const passport_1 = __importDefault(require("passport"));
const httpStatus_1 = require("../../../package/httpStatus");
const userService = __importStar(require("../service/user"));
function customPassportAuth(req, res, next) {
    passport_1.default.authenticate('local', function (_err, user, _info) {
        if (!user) {
            return next();
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return next();
        });
    })(req, res, next);
}
exports.customPassportAuth = customPassportAuth;
function loginHandler(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const isError = true;
        try {
            const reqData = req.body;
            const [validationError, validationResult] = yield userService.loginValidation(req);
            if (validationError) {
                req.responseData = { result: false, status: validationResult };
                return [isError, null];
            }
            const [fetchError, userOrHttpStatus] = yield userService.fetchUserData(reqData);
            if (fetchError) {
                req.responseData = { result: false, status: userOrHttpStatus };
                return [isError, null];
            }
            const [hashError, compareResult] = userService.compareHashPassword(reqData, userOrHttpStatus.password);
            if (hashError) {
                req.responseData = { result: false, status: compareResult };
                return [isError, null];
            }
            req.responseData = { result: true, status: httpStatus_1.HttpStatus.OK };
            return [!isError, userOrHttpStatus];
        }
        catch (e) {
            console.error("loginHandler 錯誤 ： ", e);
            req.responseData = { result: false, status: httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR };
            return [isError, null];
        }
    });
}
exports.loginHandler = loginHandler;
function registerHandler(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!(yield userService.registerValidation(req))) {
                return { result: false, status: httpStatus_1.HttpStatus.INVALID_PARAMS };
            }
            const reqBodyData = req.body;
            if (yield userService.checkUserExist(reqBodyData)) {
                return { result: false, status: httpStatus_1.HttpStatus.ERROR_ALREADY_EXIST_USER };
            }
            const [error, hashNumber] = userService.hashPassword(reqBodyData);
            if (error) {
                return { result: false, status: hashNumber };
            }
            if (!(yield userService.createUserData(reqBodyData))) {
                return { result: false, status: httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR };
            }
        }
        catch (e) {
            console.error("registerHandler 錯誤 ： ", e);
            return { result: false, status: httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR };
        }
        return { result: true, status: httpStatus_1.HttpStatus.OK };
    });
}
exports.registerHandler = registerHandler;
