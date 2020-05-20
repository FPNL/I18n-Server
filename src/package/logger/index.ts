import Logger from 'morgan';
import * as Rfs from 'rotating-file-stream';
import Path from 'path';

const path = process.env.NODE_ENV === 'production'
  ? Path.join('/tmp')
  : Path.join(__dirname, '../../log');

const accessLogStream = Rfs.createStream(
  'access.log',
  {
    interval: '1d',
    path,
  }
);
Logger.token('customStatusCode', (req, res) => String(res.customStatusCode));
Logger.format('custom', '[:customStatusCode] :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]');
const logger = Logger('custom', {
  stream: accessLogStream,
  // skip: () => config.NODE_ENV === 'dev',
});

export { logger };
