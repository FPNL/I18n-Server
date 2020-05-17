import ConnectMongo from 'connect-mongo';
import Session from 'express-session';
import * as config from '../../config';
import Mongoose from 'mongoose';

const MongoStore = ConnectMongo(Session);
const mongoSession = Session({
  cookie: {
    secure: config.SESSION_SECURE === 'true',
    domain: config.SESSION_DOMAIN
  },
  secret: config.SESSION_SECRET,
  resave: config.SESSION_RESAVE === 'true',
  saveUninitialized: config.SESSION_SAVE_UNINITIALIZED === 'true',
  store: new MongoStore({
    mongooseConnection: Mongoose.connection
  }),
});

export { mongoSession };
