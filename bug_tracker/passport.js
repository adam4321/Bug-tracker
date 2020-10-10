/******************************************************************************
**  Description:  Setup file for Google authentication with Oauth2 through
**                passport.js
******************************************************************************/

const GOOG_CREDS = require('./GOOGLE-credentials.js');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
        clientID: GOOG_CREDS.CLIENT_ID,
        clientSecret: GOOG_CREDS.CLIENT_SECRET,
        callbackURL: GOOG_CREDS.CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
    }
));
