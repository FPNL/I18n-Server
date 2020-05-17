"use strict";
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
const auth_1 = require("../auth");
const user_1 = require("../../model/user");
const httpStatus_1 = require("../../../../package/httpStatus");
jest.mock('../../util');
const { routerResponseFormatter } = require('../../util');
describe('使用者的身份被允許1', function () {
    let req = {};
    it('有一個 {使用者} 正在使用我們的服務 = jane@mail.com', () => {
        req.account = 'jane@mail.com';
    });
    it('他想要選擇 {某道門} 進入 = 查看母語', () => {
        req.baseUrl = '/api/v1/language';
        req.url = '/nativeLang';
    });
    it('他被查驗為 {角色}  = adviser', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield user_1.findUser({
            account: req.account,
        });
        req.user = res === null || res === void 0 ? void 0 : res.get();
        expect(req.user).toHaveProperty("character", 'adviser');
    }));
    it('他被查驗允許進入', (done) => {
        let res;
        auth_1.isAuthorization(req, res, done);
    });
});
describe('使用者的身份被允許2', function () {
    let req = {};
    it('有一個 {使用者} 正在使用我們的服務 = peter@mail.com', () => {
        req.account = 'peter@mail.com';
    });
    it('他想要選擇 {某道門} 進入 = 修改母語', () => {
        req.baseUrl = '/api/v1/language';
        req.url = '/alterNativeLang';
    });
    it('他被查驗為 {角色}  = manager', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield user_1.findUser({
            account: req.account,
        });
        req.user = res === null || res === void 0 ? void 0 : res.get();
        expect(req.user).toHaveProperty("character", 'manager');
    }));
    it('他被查驗允許進入', (done) => {
        let res;
        auth_1.isAuthorization(req, res, done);
    });
});
describe('使用者的身份被允許3', function () {
    let req = {};
    it('有一個 訪客 正在使用我們的服務', () => {
        req.account = 'visitor';
    });
    it('他想要選擇 {某道門} 進入 = 登入', () => {
        req.baseUrl = '/api/v1/user';
        req.url = '/login';
    });
    it('他被查驗為 {角色}  = null', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield user_1.findUser({
            account: req.account,
        });
        req.user = res === null || res === void 0 ? void 0 : res.get();
    }));
    it('他被查驗允許進入', (done) => {
        let res;
        auth_1.isAuthorization(req, res, done);
    });
});
describe('使用者的身份被不允許1', function () {
    let req = {};
    it('有一個 訪客 正在使用我們的服務', () => {
        req.account = 'visitor';
    });
    it('他想要選擇 {某道門} 進入 = 查看語言', () => {
        req.baseUrl = '/api/v1/language';
        req.url = '/list';
    });
    it('他被查驗為 {角色}  = null', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield user_1.findUser({
            account: req.account,
        });
        req.user = res === null || res === void 0 ? void 0 : res.get();
    }));
    it('他被查驗禁止進入', () => {
        let res;
        routerResponseFormatter.mockImplementation((_res, data) => {
            expect(data).toHaveProperty('status', httpStatus_1.HttpStatus.UNAUTHORIZED);
        });
        auth_1.isAuthorization(req, res, () => { });
    });
});
describe('使用者的身份被不允許2', function () {
    let req = {};
    it('有一個 {使用者} 正在使用我們的服務 = jane@mail.com', () => {
        req.account = 'jane@mail.com';
    });
    it('他想要選擇 {某道門} 進入 = 修改母語', () => {
        req.baseUrl = '/api/v1/language';
        req.url = '/alterNativeLang';
    });
    it('他被查驗為 {角色}  = adviser', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield user_1.findUser({
            account: req.account,
        });
        req.user = res === null || res === void 0 ? void 0 : res.get();
        expect(req.user).toHaveProperty("character", 'adviser');
    }));
    it('他被查驗禁止進入', () => {
        let res;
        routerResponseFormatter.mockImplementation((_res, data) => {
            expect(data).toHaveProperty('status', httpStatus_1.HttpStatus.FORBIDDEN);
        });
        auth_1.isAuthorization(req, res, () => { });
    });
});
