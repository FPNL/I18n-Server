import { isAuthorization } from '../auth';
import { UserModel, createUser, findUser } from '../../model/user';
import { HttpStatus } from '../../../../package/httpStatus';


// routerResponseFormatter is a mock function
jest.mock('../../util'); // this happens automatically with automocking
const { routerResponseFormatter } = require('../../util');
/*
目的：權限
想法:
每個角色有她 "可以做的事情" --所以-> 有張表可以查詢該角色是否可以做;

user 使用 api 後，我們須知兩件事情，第一他是誰，第二要來做什麼;
middle 查表後，就可以放行或禁止。
表的內容由 uri 加上 身份組成;
為了要對應到正確的 uri ，必須重構 router 的 path 做 map 表管理;
*/

// Feature: 目前的使用者是否被允許通過

// Scenario: 一般使用者的身份被允許
// Given 有一個 {使用者} 正在使用我們的服務 = jane@mail.com
// When 他想要選擇 {某道門} 進入 = 查看母語
// Then 他被查驗為 {角色}  = adviser
// And 他被查驗允許進入

// Scenario: 中階使用者的身份被允許
// Given 有一個 {使用者} 正在使用我們的服務 = peter@mail.com
// When 他想要選擇 {某道門} 進入 = 修改母語
// Then 他被查驗為 {角色}  = manager
// And 他被查驗允許進入

describe('使用者的身份被允許1', function () {
  let req: any = {};
  it('有一個 {使用者} 正在使用我們的服務 = jane@mail.com', () => {
    req.account = 'jane@mail.com';
  });


  it('他想要選擇 {某道門} 進入 = 查看母語', () => {
    req.baseUrl = '/api/v1/language';
    req.url = '/nativeLang';
  });
  it('他被查驗為 {角色}  = adviser', async () => {
    const res = await findUser({
      account: req.account,
    });
    req.user = res?.get();
    expect(req.user).toHaveProperty("character", 'adviser');
  });

  it('他被查驗允許進入', (done) => {
    let res: any;
    isAuthorization(req, res, done);
  });
});


describe('使用者的身份被允許2', function () {
  let req: any = {};
  it('有一個 {使用者} 正在使用我們的服務 = peter@mail.com', () => {
    req.account = 'peter@mail.com';
  });
  it('他想要選擇 {某道門} 進入 = 修改母語', () => {
    req.baseUrl = '/api/v1/language';
    req.url = '/alterNativeLang';
  });
  it('他被查驗為 {角色}  = manager', async () => {
    const res = await findUser({
      account: req.account,
    });
    req.user = res?.get();
    expect(req.user).toHaveProperty("character", 'manager');
  });

  it('他被查驗允許進入', (done) => {
    let res: any;
    isAuthorization(req, res, done);
  });
});


describe('使用者的身份被允許3', function () {
  let req: any = {};
  it('有一個 訪客 正在使用我們的服務', () => {
    req.account = 'visitor';
  });
  it('他想要選擇 {某道門} 進入 = 登入', () => {
    req.baseUrl = '/api/v1/user';
    req.url = '/login';
  });
  it('他被查驗為 {角色}  = null', async () => {
    const res = await findUser({
      account: req.account,
    });
    req.user = res?.get();
  });

  it('他被查驗允許進入', (done) => {
    let res: any;
    isAuthorization(req, res, done);
  });
});


describe('使用者的身份被不允許1', function () {
  let req: any = {};
  it('有一個 訪客 正在使用我們的服務', () => {
    req.account = 'visitor';
  });
  it('他想要選擇 {某道門} 進入 = 查看語言', () => {
    req.baseUrl = '/api/v1/language';
    req.url = '/list';
  });
  it('他被查驗為 {角色}  = null', async () => {
    const res = await findUser({
      account: req.account,
    });
    req.user = res?.get();
  });

  it('他被查驗禁止進入', () => {
    let res: any;

    routerResponseFormatter.mockImplementation((_res, data) => {
      expect(data).toHaveProperty('status', HttpStatus.UNAUTHORIZED);
    });

    isAuthorization(req, res, () => { });
  });
});


describe('使用者的身份被不允許2', function () {
  let req: any = {};
  it('有一個 {使用者} 正在使用我們的服務 = jane@mail.com', () => {
    req.account = 'jane@mail.com';
  });
  it('他想要選擇 {某道門} 進入 = 修改母語', () => {
    req.baseUrl = '/api/v1/language';
    req.url = '/alterNativeLang';
  });
  it('他被查驗為 {角色}  = adviser', async () => {
    const res = await findUser({
      account: req.account,
    });
    req.user = res?.get();
    expect(req.user).toHaveProperty("character", 'adviser');
  });

  it('他被查驗禁止進入', () => {
    let res: any;
    routerResponseFormatter.mockImplementation((_res, data) => {
      expect(data).toHaveProperty('status', HttpStatus.FORBIDDEN);
    });

    isAuthorization(req, res, () => { });
  });
});
