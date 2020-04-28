import Express = require('express');

import controller from '../controller';
import util from '../util';
import e from '../../../package/e';

const router = Express.Router();

router.get('/list', async (req, res, next): Promise<void> => {
    let responseData = await controller.Lang.r_getLangListHandler();
    if (responseData.status === e.HttpStatus.WARNING_NOT_EXIST_KEY) {
        responseData = await controller.Lang.getLanguageListHandler();
    }
    util.routerResponseFormatter(res, responseData);
});

router.get('/content', async (req, res, next): Promise<void> => {
    const responseData = await controller.Lang.getWordsContentHandler(req);
    util.routerResponseFormatter(res, responseData);
}, (req, res): void => {
    // TODO Redis store
    // const RedisStore();
});

router.post('/addLanguage', async (req, res, next): Promise<void> => {
    const responseData = await controller.Lang.addLanguageHandler(req);
    util.routerResponseFormatter(res, responseData);
})

// 目前後端先以創建多組詞語為主，但前端使用上先以 創建單一為原則。
router.post('/addWords', async (req, res, next): Promise<void> => {
    const responseData = await controller.Lang.addWordsHandler(req);
    util.routerResponseFormatter(res, responseData);
}, (req, res): void => {
    // TODO Redis store
    // const RedisStore();
});

router.put('/alterWords', async (req, res, next): Promise<void> => {
    const responseData = await controller.Lang.alterWordsHandler(req);
    util.routerResponseFormatter(res, responseData);
})

router.delete('/deleteLanguage', async (req, res, next): Promise<void> => {
    const responseData = await controller.Lang.deleteLangHandler(req);
    util.routerResponseFormatter(res, responseData);
})

router.delete('/deleteWords', async (req, res, next): Promise<void> => {
    const responseData = await controller.Lang.deleteWordsHandler(req);
    util.routerResponseFormatter(res, responseData);
}, (req, res): void => {
    // TODO Redis Delete
    // const RedisDelete();
});

router.put('/nativeLang', async (req, res, next) => {
    res.send("尚未建造...");
})

export default router;
