import Express = require('express');

import user from './user';
import lang from './language';
import { isAuthByPassport } from '../controller/auth';

const Router_v1 = Express.Router();

/* GET home page. */
Router_v1.use('/user', user);
Router_v1.use('/language', isAuthByPassport, lang);

export default Router_v1;
