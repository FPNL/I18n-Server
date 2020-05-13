// Package
import Express from 'express';
// Module
import { isAuthByPassport } from './controller/auth';
import userRouter from './routes/user';
import langRouter from './routes/language';

const subApp_v1 = Express();

subApp_v1.use('/user', userRouter);
subApp_v1.use('/language', isAuthByPassport, langRouter);

export default subApp_v1;
