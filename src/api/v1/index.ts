// Package
import Express from 'express';
// Module
import { isAuthByPassport, isAuthorization } from './middleware/auth';
import userRouter from './routes/user';
import langRouter from './routes/language';

const subApp_v1 = Express();

subApp_v1.use('/user', isAuthorization, userRouter);
subApp_v1.use('/language', isAuthorization, isAuthByPassport, langRouter);

export default subApp_v1;
