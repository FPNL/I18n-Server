import Express from 'express';
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

// router.get('/content', async (req, res, next): Promise<void> => {
//     const responseData = await Controller.Lang.readWordContentHandler(req);
//     Util.routerResponseFormatter(res, responseData);
//     next();
// }, (req, res): void => {
//     // TODO Redis store
//     // const RedisStore();
// });

// router.post('/addLanguage', async (req, res, next): Promise<void> => {
//     const responseData = await Controller.Lang.addLanguageHandler(req);
//     Util.routerResponseFormatter(res, responseData);
// })

// router.post('/createWord', async (req, res, next): Promise<void> => {
//     const responseData = await Controller.Lang.createWordHandler(req);
//     Util.routerResponseFormatter(res, responseData);
//     next();
// }, (req, res): void => {
//     // TODO Redis store
//     // const RedisStore();
// })

// router.delete('/deleteLanguage', async (req, res, next): Promise<void> => {
//     next()
// })

// router.delete('/deleteWord', async (req, res, next): Promise<void> => {
//     const responseData = await Controller.Lang.deleteWordHandler(req);
//     Util.routerResponseFormatter(res, responseData);
// }, (req, res): void => {
//     // TODO Redis Delete
//     // const RedisDelete();
// })

export default router;
