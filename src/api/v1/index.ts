import Express = require('express');

import router_v1 from './routes';

const subApp_v1 = Express();

subApp_v1.use('/v1', router_v1);

export default subApp_v1;
