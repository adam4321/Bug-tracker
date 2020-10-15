/******************************************************************************
**  Description:   Node.js web server for the server-side rendered bug tracker
**                 dashboard. This file is the entry point for the application.
**                 This is reached when the user is redirected after entering
**                 an email and password into the authentication service.
**
**  Path of forever binary file:    ./node_modules/forever/bin/forever
******************************************************************************/

// Set up express
const express = require('express');
const app = express();

// PORT NUMBER - Set static port for the appliction 
app.set('port', 5000);

// Set up express-handlebars
const handlebars = require('express-handlebars');
app.set('view engine', '.hbs');
app.engine('.hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'main',
    extname: '.hbs'
}));


// Set up body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up MySQL using dbcon.js file
const mysql = require('./db-config.js');
app.set('mysql', mysql);

// Set up route to static files
app.use('/bug_tracker', express.static('public'));

// Set up cookie session and configure session storage
const cookieSession = require('cookie-session');
app.use(cookieSession({
    name: 'session-name',
    keys: ['key1', 'key2']
}))

// Include and configure passport
const passport = require('passport');
require('./passport.js');
app.use(passport.initialize());
app.use(passport.session());


/* PAGE ROUTES ---------------------------------------------------------------*/

// LOGIN PAGE ROUTES
app.use('/bug_tracker/login', require('./routes/login-page.js'));

// USER'S BUG PAGE ROUTES
app.use('/bug_tracker/home', require('./routes/user-home-page.js'));

// All BUGS PAGE ROUTES
app.use('/bug_tracker/all_bugs', require('./routes/all-bugs-page.js'));

// EDIT BUG PAGE ROUTES
app.use('/bug_tracker/edit_bug', require('./routes/edit-bug-page.js'));

// UPDATE ACCOUNT PAGE ROUTES
app.use('/bug_tracker/settings', require('./routes/update-account-page.js'));

// UPDATE OR ADD PROGRAMMERS PAGE ROUTES
app.use('/bug_tracker/programmers', require('./routes/update-programmers-page.js'));

// UPDATE OR ADD PROJECTS PAGE ROUTES
app.use('/bug_tracker/projects', require('./routes/update-projects-page.js'));

// UPDATE OR ADD COMPANIES PAGE ROUTES
app.use('/bug_tracker/companies', require('./routes/update-company-page.js'));


/* AUTHENTICATION ROUTES ---------------------------------------------------- */

// REQUEST AUTH
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// POST-AUTH REDIRECT
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login/failed' }),
    function(req, res) {
        res.redirect('/bug_tracker/home');
    }
);

// LOG OUT ROUTE - for all pages
app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/bug_tracker/login');
})


/* ERROR ROUTES -------------------------------------------------------------*/

// Middleware - Function to Check user is Logged in
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}

// PAGE NOT FOUND - Route for bad path error page
app.use(checkUserLoggedIn, (req, res) => {
    res.status(404).render('404');
});
   
// INTERNAL SERVER ERROR - Route for a server-side error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('500');
});


/* LISTEN ON PORT -----------------------------------------------------------*/

// Set to render on a static port set globally
app.listen(app.get('port'), () => {
    console.log(`\nExpress started at http://localhost:${app.get('port')}/bug_tracker/login\nPress ctrl-C to terminate.\n`);
});
