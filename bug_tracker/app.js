/**********************************************************************************
**  Description:   Node.js web server for the server-side rendered bug tracker
**                 dashboard. This file is the entry point for the application.
**
**                 Path of forever binary file: ./node_modules/forever/bin/forever
**********************************************************************************/

// Set up express
const express = require('express');
const app = express();

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

// PORT NUMBER - Set static port for the appliction 
app.set('port', 5000);


/* PAGE ROUTES ---------------------------------------------------------------*/


// MAIN BUG PAGE ROUTES
app.use('/bug_tracker/', require('./routes/user-home.js'));

// All BUGS PAGE ROUTES
app.use('/bug_tracker/all_bugs', require('./routes/bugs-page.js'));

// EDIT BUG PAGE ROUTES
app.use('/bug_tracker/edit-bug', require('./routes/edit-bug-page.js'));

// PROGRAMMERS PAGE ROUTES
app.use('/bug_tracker/programmers', require('./routes/programmers-page.js'));

// PROJECTS PAGE ROUTES
app.use('/bug_tracker/projects', require('./routes/projects-page.js'));

// COMPANIES PAGE ROUTES
app.use('/bug_tracker/companies', require('./routes/company-page.js'));


/* ERROR ROUTES -------------------------------------------------------------*/

// PAGE NOT FOUND - Route for bad path error page
app.use((req, res) => {
    res.status(404);
    res.render('404');
});
   
// INTERNAL SERVER ERROR - Route for a server-side error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


/* LISTEN ON PORT -----------------------------------------------------------*/

// Set to render on a static port set globally
app.listen(app.get('port'), () => {
    console.log(`\nExpress started at http://localhost:${app.get('port')}/bug_tracker/\nPress ctrl-C to terminate.\n`);
});
