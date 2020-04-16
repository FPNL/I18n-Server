const express = require('express');
const router = express.Router();
const { user: UserController } = require('../controller')
const { HttpStatus, HttpStatusMessage } = require('../../../package/e');

router.post('/login', async (req, res, next) => {
  const responseData = await UserController.loginHandler(req);
  response(res, responseData);
});

router.post('/register', async (req, res, next) => {
  const responseData = await UserController.registerHandler(req);
  response(res, responseData);
})

function response(res, responseData) {
  const message = HttpStatusMessage.get(responseData.status);

  if(responseData.status > 600) {
    responseData.status = 400;
  }

  res
      .status(responseData.status)
      .json({ result: responseData.result, message });

}

module.exports = router;