import Express = require('express');

import Router_v1 from './routes';

const SubApp_v1 = Express();

SubApp_v1.use('/v1', Router_v1);

export default SubApp_v1;
