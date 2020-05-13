// import { expect } from 'chai';
// import sinon from 'sinon';
// const { describe, expect, it } = require('@jest/globals');
// import controller from '../user';
const controller = require('../user');
// import controller from '../user';

jest.mock('mongoose');
jest.mock('redis');

describe('Controller', () => {
  it('登入測試', async () => {
    // const req = sinon.fake();
    const req: any = jest.fn();
    const [error, result] = await controller.loginHandler(req);
    expect(controller.test()).toBe('a');
  });

});


// describe('授權', () => {
//   beforeAll(() => {
//   });
//   test('登入', async () => {
//     jest.mock('Redis', () => {

//     });
//     const myMock: any = jest.fn();

//     let [error, user] = await controller.loginHandler(myMock);

//     expect(error).toBeTruthy();
//     expect(user).toBeNull();
//   });
// });
