const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

//load user model
const User = require('../models/user');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          //match user
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: 'No User Found' });
          }
          //match password
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: 'Password Incorrect' });
          }
          return done(null, user);
        } catch (e) {
          console.log('error in passport strategy');
          return done(null, false, { message: 'Something went wrong ' });
        }
      }
    )
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
