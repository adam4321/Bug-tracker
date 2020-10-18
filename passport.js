/******************************************************************************
**  Description:  Setup file for Google authentication with Oauth2 through
**                passport.js
******************************************************************************/

const passport = require('passport');

// Include Oauth2 strategies
const CREDS = require('./AUTH-credentials.js');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;

// Process the user's token
passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Create Oauth2 strategies
passport.use(new GoogleStrategy({
        clientID: CREDS.GOOGLE_CLIENT_ID,
        clientSecret: CREDS.GOOGLE_CLIENT_SECRET,
        callbackURL: CREDS.GOOGLE_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

// passport.use(new FacebookStrategy({
//         clientID: CREDS.FACEBOOK_CLIENT_ID,
//         clientSecret: CREDS.FACEBOOK_CLIENT_SECRET,
//         callbackURL: CREDS.FACEBOOK_CALLBACK_URL,
//         profileFields: ['id', 'displayName', 'photos', 'email']
//     }, 
//     function(accessToken, refreshToken, profile, done) {
//         return done(null, profile);
//     }
// ));
