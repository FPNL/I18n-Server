import Express = require('express');

import User from './user';
import Lang from './language';
import {isAuthByPassport} from '../controller/auth';
const Router_v1 = Express.Router();

/* GET home page. */
Router_v1.use('/user', User);
Router_v1.use('/language', isAuthByPassport, Lang);

export default Router_v1;
