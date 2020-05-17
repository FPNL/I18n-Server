import Logger from 'morgan';
import * as Rfs from 'rotating-file-stream';
import Path from 'path';

const accessLogStream = Rfs.createStream(
  'access.log',
  {
    path: Path.join(__dirname, '../../log'),
    interval: '1d'
  }
);

const logger = Logger('common', {
  stream: accessLogStream,
  // skip: () => config.NODE_ENV === 'dev',
});

export { logger };
