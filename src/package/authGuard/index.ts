import Passport =  require('passport');
import LocalStrategy = require('passport-local');

import model from '../../api/v1/model';
import controller from '../../api/v1/controller';

Passport.serializeUser(function (user: any, done) {
  done(null, user.id);
});

Passport.deserializeUser(async function (id: string, done) {
  try {
    const user = await model.User.User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

Passport.use(new LocalStrategy.Strategy(
  {
    usernameField: 'account',
    passReqToCallback: true,
  },
  async function (req, _account, _password, done) {
    const [err, user] = await controller.User.loginHandler(req);
    done(err, user);
  }
));

export default { Passport };
