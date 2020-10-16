/******************************************************************************
**  Description:  Setup file for Google authentication with Oauth2 through
**                passport.js
******************************************************************************/

const AUTH_CREDS = require('./AUTH-credentials.js');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
        clientID: AUTH_CREDS.GOOGLE_CLIENT_ID,
        clientSecret: AUTH_CREDS.GOOGLE_CLIENT_SECRET,
        callbackURL: AUTH_CREDS.GOOGLE_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));
