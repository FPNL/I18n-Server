// Package
import Express from 'express';
// Module
import * as langController from '../controller/language';
import { routerResponseFormatter } from '../util';
import { HttpStatus } from '../../../package/httpStatus';

const router = Express.Router();
export const langPath = {
    LangList: '/list',
    WordsContent: '/content',
    LangAdd: '/addLanguage',
    WordsAdd: '/addWords',
    WordsAlter: '/alterWords',
    LangDelete: '/deleteLanguage',
    WordsDelete: '/deleteWords',
    NativeLangGet: '/nativeLang',
    NativeLangUpdate: '/alterNativeLang'
};
router.get(langPath.LangList, async (req, res, next): Promise<void> => {
    let responseData = await langController.r_getLangListHandler();
    if (responseData.status === HttpStatus.WARNING_NOT_EXIST_KEY) {
        responseData = await langController.getLanguageListHandler();
    }
    routerResponseFormatter(res, responseData);
});

router.get(langPath.WordsContent, async (req, res, next): Promise<void> => {
    const responseData = await langController.getWordsContentHandler(req);
    routerResponseFormatter(res, responseData);
}, (req, res): void => {
    // TODO Redis store
    // const RedisStore();
});

router.post(langPath.LangAdd, async (req, res, next): Promise<void> => {
    const responseData = await langController.addLanguageHandler(req);
    routerResponseFormatter(res, responseData);
});

// 目前後端先以創建多組詞語為主，但前端使用上先以 創建單一為原則。
router.post(langPath.WordsAdd, async (req, res, next): Promise<void> => {
    const responseData = await langController.addWordsHandler(req);
    routerResponseFormatter(res, responseData);
}, (req, res): void => {
    // TODO Redis store
    // const RedisStore();
});

router.put(langPath.WordsAlter, async (req, res, next): Promise<void> => {
    const responseData = await langController.alterWordsHandler(req);
    routerResponseFormatter(res, responseData);
});

router.delete(langPath.LangDelete, async (req, res, next): Promise<void> => {
    const responseData = await langController.deleteLangHandler(req);
    routerResponseFormatter(res, responseData);
});

router.delete(langPath.WordsDelete, async (req, res, next): Promise<void> => {
    const responseData = await langController.deleteWordsHandler(req);
    routerResponseFormatter(res, responseData);
}, (req, res): void => {
    // TODO Redis Delete
    // const RedisDelete();
});

router.get(langPath.NativeLangGet, async (req, res, next) => {
    let responseData = await langController.r_getNativeLangHandler();
    if (responseData.status === HttpStatus.WARNING_NOT_EXIST_KEY) {
        responseData = await langController.getNativeLanguage();
    }
    routerResponseFormatter(res, responseData);
});

router.put(langPath.NativeLangUpdate, async (req, res, next) => {
    const responseData = await langController.updateNativeLang(req);
    routerResponseFormatter(res, responseData);
});

export default router;
