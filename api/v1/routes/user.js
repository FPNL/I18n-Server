const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');
const { user: UserController } = require('../controller')

/* GET users listing. */
router.post('/login', async (req, res, next) => {
  // service return HttpStatus and result;
  // router -> controller -> service -> model
  const reqData = req.body;

  let responseData = await UserController.login(reqData);

  let message = HttpStatus.getStatusText(responseData.status);
  res
      .status(responseData.status)
      .json({ result: responseData.result, message});
});

router.post('/register', (req, res, next) => {
  // service return HttpStatus and result;
  const reqData = req.body;

  let responseData = UserController.register(reqData);

  let message = HttpStatus.getStatusText(responseData.status);
  res
      .status(responseData.status)
      .json({ result: responseData.result, message})
})

module.exports = router;