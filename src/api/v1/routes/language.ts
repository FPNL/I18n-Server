import Express = require('express');

// import { languageController } from '../controller';
import Controller from '../controller';
import Util from '../util';

const router = Express.Router();

router.get('/list', async (req, res, next): Promise<void> => {
    const responseData = await Controller.Lang.getLanguageListHandler(req);
    Util.routerResponseFormatter(res, responseData);
}, (req, res): void => {
    // TODO Redis store
    // const RedisStore();
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
}, (req, res) => {
    // TODO Redis Store
    // const RedisStore()0
})

// 目前後端先以創建多組詞語為主，但前端使用上先以 創建單一為原則。
router.post('/addWords', async (req, res, next): Promise<void> => {
    const responseData = await Controller.Lang.addWordsHandler(req);
    Util.routerResponseFormatter(res, responseData);
}, (req, res): void => {
    // TODO Redis store
    // const RedisStore();
});

router.post('/alterWords', async (req, res, next): Promise<void> => {
    const responseData = await Controller.Lang.alterWordsHandler(req);
    Util.routerResponseFormatter(res, responseData);
})

router.delete('/deleteLanguage', async (req, res, next): Promise<void> => {
    res.send("建造中．．．")
})

router.delete('/deleteWords', async (req, res, next): Promise<void> => {
    // const responseData = await Controller.Lang.deleteWordHandler(req);
    // Util.routerResponseFormatter(res, responseData);
    res.send("尚未建造．．．")
}, (req, res): void => {
    // TODO Redis Delete
    // const RedisDelete();
})

export default router;
