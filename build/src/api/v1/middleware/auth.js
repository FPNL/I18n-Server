"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorization = exports.isAuthByPassport = void 0;
const util_1 = require("../util");
const httpStatus_1 = require("../../../package/httpStatus");
const user_1 = require("../routes/user");
const language_1 = require("../routes/language");
function isAuthByPassport(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    const responseData = { status: httpStatus_1.HttpStatus.UNAUTHORIZED, result: false };
    util_1.routerResponseFormatter(res, responseData);
}
exports.isAuthByPassport = isAuthByPassport;
const apiV1 = {
    "/api/v1/user": new Map([
        [user_1.userPath.Login, true],
        [user_1.userPath.Register, true],
    ]),
    "/api/v1/language": new Map([
        [language_1.langPath.LangList, ['admin', 'manager', 'adviser']],
        [language_1.langPath.LangAdd, ['admin', 'manager']],
        [language_1.langPath.LangDelete, ['admin', 'manager']],
        [language_1.langPath.WordsContent, ['admin', 'manager', 'adviser']],
        [language_1.langPath.WordsAdd, ['admin', 'manager']],
        [language_1.langPath.WordsAlter, ['admin', 'manager']],
        [language_1.langPath.WordsDelete, ['admin', 'manager']],
        [language_1.langPath.NativeLangGet, ['admin', 'manager', 'adviser']],
        [language_1.langPath.NativeLangUpdate, ['admin', 'manager']],
    ])
};
function isAuthorization(req, res, next) {
    const { baseUrl, url, user } = req;
    const access = apiV1[baseUrl].get(url);
    if (access === true) {
        next();
    }
    else if (!user) {
        const responseData = { status: httpStatus_1.HttpStatus.UNAUTHORIZED, result: false };
        util_1.routerResponseFormatter(res, responseData);
    }
    else if (access === null) {
        const responseData = { status: httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR, result: false };
        util_1.routerResponseFormatter(res, responseData);
    }
    else if (access === false || access.includes((user.character))) {
        next();
    }
    else {
        const responseData = { status: httpStatus_1.HttpStatus.FORBIDDEN, result: false };
        util_1.routerResponseFormatter(res, responseData);
    }
}
exports.isAuthorization = isAuthorization;
