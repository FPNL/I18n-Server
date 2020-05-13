// Package
import Express from 'express';
// Module
import * as langController from '../controller/language';
import { routerResponseFormatter } from '../util';
import { HttpStatus } from '../../../package/httpStatus';

const router = Express.Router();

router.get('/list', async (req, res, next): Promise<void> => {
    let responseData = await langController.r_getLangListHandler();
    if (responseData.status === HttpStatus.WARNING_NOT_EXIST_KEY) {
        responseData = await langController.getLanguageListHandler();
    }
    routerResponseFormatter(res, responseData);
});

router.get('/content', async (req, res, next): Promise<void> => {
    const responseData = await langController.getWordsContentHandler(req);
    routerResponseFormatter(res, responseData);
}, (req, res): void => {
    // TODO Redis store
    // const RedisStore();
});

router.post('/addLanguage', async (req, res, next): Promise<void> => {
    const responseData = await langController.addLanguageHandler(req);
    routerResponseFormatter(res, responseData);
});

// 目前後端先以創建多組詞語為主，但前端使用上先以 創建單一為原則。
router.post('/addWords', async (req, res, next): Promise<void> => {
    const responseData = await langController.addWordsHandler(req);
    routerResponseFormatter(res, responseData);
}, (req, res): void => {
    // TODO Redis store
    // const RedisStore();
});

router.put('/alterWords', async (req, res, next): Promise<void> => {
    const responseData = await langController.alterWordsHandler(req);
    routerResponseFormatter(res, responseData);
});

router.delete('/deleteLanguage', async (req, res, next): Promise<void> => {
    const responseData = await langController.deleteLangHandler(req);
    routerResponseFormatter(res, responseData);
});

router.delete('/deleteWords', async (req, res, next): Promise<void> => {
    const responseData = await langController.deleteWordsHandler(req);
    routerResponseFormatter(res, responseData);
}, (req, res): void => {
    // TODO Redis Delete
    // const RedisDelete();
});

router.get('/nativeLang', async (req, res, next) => {
    let responseData = await langController.r_getNativeLangHandler();
    if (responseData.status === HttpStatus.WARNING_NOT_EXIST_KEY) {
        responseData = await langController.getNativeLanguage();
    }
    routerResponseFormatter(res, responseData);
});

router.put('/nativeLang', async (req, res, next) => {
    const responseData = await langController.updateNativeLang(req);
    routerResponseFormatter(res, responseData);
});

export default router;
