const express = require('express');
const router = express.Router();
const { languageController } = require('../controller')
const util = require('../util');
router.get('/list', async (req, res, next) => {
    const responseData = await languageController.getLanguageListHandler(req);

    util.routerResponseFormatter(res, responseData);
    next();
}, (req, res) => {
    // TODO Redis store
    // const RedisStore();
});

router.get('/content', async (req, res, next) => {
    const responseData = await languageController.readWordContentHandler(req);
    util.routerResponseFormatter(res, responseData);
    next();
}, (req, res) => {
    // TODO Redis store
    // const RedisStore();
});

router.post('/addLanguage', async (req, res, next) => {
    const responseData = await languageController.addLanguageHandler(req);
    util.routerResponseFormatter(res, responseData);
})

router.post('/createWord', async (req, res, next) => {
    const responseData = await languageController.createWordHandler(req);
    util.routerResponseFormatter(res, responseData);
    next();
}, (req, res) => {
    // TODO Redis store
    // const RedisStore();
})

router.delete('/deleteLanguage', async (req, res, next) => {
    next()
})

router.delete('/deleteWord', async (req, res, next) => {
    const responseData = await languageController.deleteWordHandler(req);
    util.routerResponseFormatter(res, responseData);
}, (req, res) => {
    // TODO Redis Delete
    // const RedisDelete();
})

module.exports = router;
