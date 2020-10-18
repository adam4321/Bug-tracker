/******************************************************************************
**  Description:  Setup file for Google authentication with Oauth2 through
**                passport.js
******************************************************************************/

const AUTH_CREDS = require('./AUTH-credentials.js');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const FACE_CREDS = require('./credentials.js')
const FacebookStrategy = require('passport-facebook').Strategy;

// Process the user's token
passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Create Oauth2 strategies
passport.use(new GoogleStrategy({
        clientID: GOOG_CREDS.GOOGLE_CLIENT_ID,
        clientSecret: GOOG_CREDS.GOOGLE_CLIENT_SECRET,
        callbackURL: GOOG_CREDS.GOOGLE_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

passport.use(new FacebookStrategy({
        clientID: FACE_CREDS.FACEBOOK_CLIENT_ID,
        clientSecret: FACE_CREDS.FACEBOOK_CLIENT_SECRET,
        callbackURL: FACE_CREDS.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'photos', 'email']
    }, 
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));
