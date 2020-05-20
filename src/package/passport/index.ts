import Passport from 'passport';
import LocalStrategy from 'passport-local';

import { UserModel } from '../../api/v1/repository/user';
import { loginHandler } from '../../api/v1/controller/user';


Passport.serializeUser(function (user: any, done) {
  done(null, user._id.toString());
});

Passport.deserializeUser(async function (id: string, done) {
  try {
    const user = await UserModel.findById(id);
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
    const [err, user] = await loginHandler(req);
    done(err, user);
  }
));

export default Passport;
