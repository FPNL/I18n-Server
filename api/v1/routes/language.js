const express = require('express');
const router = express.Router();
const { languageController } = require('../controller')
const util = require('../util');

router.get('/list', async (req, res, next) => {
    // const responseData = await UserController.loginHandler(req);
    // response(res, responseData);
    next()
});

// TODO
router.get('/content', async (req, res, next) => {
    next()
});

router.post('/addLanguage', async (req, res, next) => {
    next()
})

router.post('/createWord', async (req, res, next) => {
    const responseData = await languageController.createWordsHandler(req);
    util.routerResponseFormatter(res, responseData);
})

router.delete('/deleteLanguage', async (req, res, next) => {
    next()
})

module.exports = router;
