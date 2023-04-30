const passport=require("passport")
const dotenv=require("dotenv");
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

dotenv.config()
passport.use(new GoogleStrategy({
    clientID:   process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "localhost:8080/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
   done(null,profile)
  }
));