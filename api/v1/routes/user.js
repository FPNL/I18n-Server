const express = require('express');
const router = express.Router();
const { userController } = require('../controller');
const util = require('../util');

router.post('/login', async (req, res, next) => {
  const responseData = await userController.loginHandler(req);
  util.routerResponseFormatter(res, responseData);
});

router.post('/register', async (req, res, next) => {
  const responseData = await userController.registerHandler(req);
  util.routerResponseFormatter(res, responseData);
})

module.exports = router;