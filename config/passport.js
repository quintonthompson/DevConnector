const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

//passport is a parameter passed from server at "require("config/passport")(passport);"
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      //payload is what I passed in from users.js jwt.sign
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user); //null because there is no error , and user that is found
          }
          return done(null, false); //null because there is no error, and false becuase user not found
        })
        .catch(err => console.log(err));
    })
  );
};
