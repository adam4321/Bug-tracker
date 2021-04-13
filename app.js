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
const HANDLEBARS_HELPERS = require('./HANDLEBARS_HELPERS.js');
app.set('view engine', '.hbs');
app.engine('.hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: HANDLEBARS_HELPERS
}));

// Set up body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up MySQL using dbcon.js file
const mysql = require('./db-config.js');
app.set('mysql', mysql);

// Set up path to static files
let path = require('path');
app.use('/bug_tracker/', express.static(path.join(__dirname, 'public')));

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
app.use('/bug_tracker/login', require('./routes/login-routes.js'));

// USER'S BUG PAGE ROUTES
app.use('/bug_tracker/home', require('./routes/your-bugs-routes.js'));

// All BUGS PAGE ROUTES
app.use('/bug_tracker/all_bugs', require('./routes/all-bug-routes.js'));

// ADD BUG ROUTES
app.use('/bug_tracker/add_bug', require('./routes/add-bug-routes.js'));

// EDIT BUG PAGE ROUTES
app.use('/bug_tracker/edit_bug', require('./routes/edit-bug-routes.js'));

// PROJECTS PAGE ROUTES - DISPLAY, ADD, UPDATE, DELETE
app.use('/bug_tracker/projects', require('./routes/projects-routes.js'));

// ADD_PROJECT PAGE ROUTES - DISPLAY, ADD
app.use('/bug_tracker/add_project', require('./routes/add-project-routes.js'));

// EDIT_PROJECT PAGE ROUTES - DISPLAY, ADD
app.use('/bug_tracker/edit_project', require('./routes/edit-project-routes.js'));

// COMPANIES PAGE ROUTES - DISPLAY, DELETE
app.use('/bug_tracker/companies', require('./routes/company-routes.js'));

// ADD_COMPANY PAGE ROUTES - DISPLAY, ADD
app.use('/bug_tracker/add_company', require('./routes/add-company-routes.js'));

// EDIT_COMPANY PAGE ROUTES - DISPLAY, UPDATE
app.use('/bug_tracker/edit_company', require('./routes/edit-company-routes.js'));

// PROGRAMMERS PAGE ROUTES - DISPLAY, UPDATE, DELETE 
app.use('/bug_tracker/programmers', require('./routes/programmers-routes.js'));

// EDIT_PROGRAMMER PAGE ROUTES - DISPLAY, UPDATE 
app.use('/bug_tracker/edit_programmer', require('./routes/edit-programmer-routes.js'));

// ADMIN PAGE ROUTES
app.use('/bug_tracker/admin', require('./routes/admin-routes.js'));


/* AUTHENTICATION ROUTES ---------------------------------------------------- */

// GOOGLE AUTH REQUEST 
app.get('/bug_tracker/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// GOOGLE POST-AUTH REDIRECT
app.get('/bug_tracker/auth/google/callback', passport.authenticate('google', { failureRedirect: '/bug_tracker/login/failed' }),
    (req, res) => {
        // Route the user to the homepage
        res.redirect('/bug_tracker/home');
    }
);

// LOG OUT ROUTE - for all pages
app.get('/bug_tracker/logout', (req, res) => {
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
    // Initialize empty context object with Google user props
    let context = {};
    context.id = req.user.id;
    context.email = req.user.email;
    context.name = req.user.displayName;
    context.photo = req.user.picture;

    res.status(404).render('404', context);
});
   
// INTERNAL SERVER ERROR - Route for a server-side error
app.use((err, req, res, next) => {
    // Initialize empty context object with Google user props
    let context = {};
    context.id = req.user.id;
    context.email = req.user.email;
    context.name = req.user.displayName;
    context.photo = req.user.picture;

    console.error(err.stack + '\n');
    res.status(err.status || 500).render('500', context);
});


/* LISTEN ON PORT -----------------------------------------------------------*/

// Set to render on a static port set globally
app.listen(app.get('port'), () => {
    console.log(`\nExpress started at http://localhost:${app.get('port')}/bug_tracker/login\nPress ctrl-C to terminate.\n`);
});
