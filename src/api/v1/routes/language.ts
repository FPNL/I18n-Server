import Express = require('express');

import Controller from '../controller';
import Util from '../util';
import ErrorPackage from '../../../package/e';

const router = Express.Router();

router.get('/list', async (req, res, next): Promise<void> => {
    let responseData = await Controller.Lang.r_getLangListHandler();
    if (responseData.status === ErrorPackage.HttpStatus.WARNING_NOT_EXIST_KEY) {
        responseData = await Controller.Lang.getLanguageListHandler();
    }
    Util.routerResponseFormatter(res, responseData);
});

router.get('/content', async (req, res, next): Promise<void> => {
    const responseData = await Controller.Lang.getWordsContentHandler(req);
    Util.routerResponseFormatter(res, responseData);
}, (req, res): void => {
    // TODO Redis store
    // const RedisStore();
});

router.post('/addLanguage', async (req, res, next): Promise<void> => {
    const responseData = await Controller.Lang.addLanguageHandler(req);
    Util.routerResponseFormatter(res, responseData);
})

// 目前後端先以創建多組詞語為主，但前端使用上先以 創建單一為原則。
router.post('/addWords', async (req, res, next): Promise<void> => {
    const responseData = await Controller.Lang.addWordsHandler(req);
    Util.routerResponseFormatter(res, responseData);
}, (req, res): void => {
    // TODO Redis store
    // const RedisStore();
});

router.put('/alterWords', async (req, res, next): Promise<void> => {
    const responseData = await Controller.Lang.alterWordsHandler(req);
    Util.routerResponseFormatter(res, responseData);
})

router.delete('/deleteLanguage', async (req, res, next): Promise<void> => {
    const responseData = await Controller.Lang.deleteLangHandler(req);
    Util.routerResponseFormatter(res, responseData);
})

router.delete('/deleteWords', async (req, res, next): Promise<void> => {
    const responseData = await Controller.Lang.deleteWordsHandler(req);
    Util.routerResponseFormatter(res, responseData);
}, (req, res): void => {
    // TODO Redis Delete
    // const RedisDelete();
});

router.put('/nativeLang', async (req, res, next) => {
    res.send("尚未建造...");
})

export default router;
