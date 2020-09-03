/**********************************************************************************
**  Description:   Node.js web server for the user dashboard service
**
**                 Path of forever binary file: ./node_modules/forever/bin/forever
**********************************************************************************/

// Set up express
var express = require('express');
var app = express();

// Set up express-handlebars
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Set up body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up MySQL using dbcon.js file
var mysql = require('./db-config.js');

// Set up route to static files
app.use(express.static('public'));

// Set port number
app.set('port', 5000);


// Create route for simple get request to render the home page.
app.get('/', function renderHome(req, res) {
    const query = `SELECT firstName, lastName, programmerId FROM Programmers WHERE programmerId = ?`
    
    // See if user with email at end of query string exists in database
    mysql.pool.query(query, req.query.uid,
    function(err, rows, fields) {
        if (err) {
           next(err);
           return;
        }
        
        // Initialize empty context array
        let context = [];
        
        // If the user does not exist in the database, render user-account page
        if (rows.length === 0) {
		    context.uid = req.query.uid;    
            res.render("user-account", context);
        }
	    
        // Otherwise, render user home page
        else
	    {
		    context.name = rows[0].firstName + " " + rows[0].lastName;
            context.uid = req.query.uid;
            res.render("user-home", context);
	    }
    });
});


// Create route to create new user in the database
app.post('/add-user', function insertData(req, res, next) {
    const query = `INSERT INTO Programmers (programmerId, email, firstName, lastName, mobile_number, startDate, accessLevel)
                        VALUES (?, ?, ?, ?, ?, ?, ?)`
    
    mysql.pool.query(query, 
        [
            req.body.uid,
            req.body.email,
            req.body.name, 
            req.body.phone, 
            req.body.birthday, 
            req.body.subscribe, 
            req.body.alerts
        ], 
        function(err, result) {
            if (err) {
                next(err);
                return;
            }
        
            res.end()
        }
    );
});


// Create route for get request to render update account page
app.get('/update-account', function renderUpdateForm(req, res) {
    const query = `SELECT programmerId, firstName, lastName, email, mobile_number, dateStarted, accessLevel
                    FROM Programmers
                    WHERE programmerId = ?`

    // See if user with email at end of query string exists in database
    mysql.pool.query(query, decodeURIComponent([req.query.uid]),
        function(err, rows, fields) {
            if (err) {
            next(err);
            return;
            }
            
            // If the user does not exist in the database, redirect to login page
            if (rows.length === 0) {
                res.render('login-redirect');
            }
            
            // Otherwise, pull the user's information from returned results to send to handlebars page
            else
            {
                // Initialize empty context array
                var context = [];
            
                // Fill context array
                context.email = decodeURIComponent([req.query.uid]);
                context.name = rows[0].firstName + " " + rows[0].lastName;
                context.phone = rows[0].mobile_number;
                // var birthdayISOString = rows[0].date_of_birth;
                // context.birthday = birthdayISOString.slice(0, 10);
                // context.subscribe = rows[0].subscribe_to_newsletter;
                // context.alerts = rows[0].receive_mobile_alerts;

                // Render update account page
                res.render("update-account", context); 
            }
        }
    );
});


// Create route to update information for an existing user in the database
app.post('/update-user', function updateData(req, res, next) {
    const query = `UPDATE Programmers SET firstName = ?, lastName = ?, email = ?, mobile_number = ?, dateStarted = ?, accessLevel = ?
                    WHERE programmerId = ?`
    
    mysql.pool.query(query, 
        [
            req.body.name,
            req.body.phone, 
            req.body.birthday, 
            req.body.subscribe, 
            req.body.alerts, 
            req.body.email
        ], 
        function(err, result) {
            if (err) {
                next(err);
                return;
            }
            
            res.end()
        }
    );
});


// Create route for serving login redirection page if script sends users here
app.get('/login-redirect', function renderLogin(req, res) {
    res.render("login-redirect");
});


// Route not found
app.use(function(req,res) {
    res.status(404);
    res.render('404');
});
   

// Server Error
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


// Listen on port and display message to indicate listening
app.listen(app.get('port'), function(){
    console.log('\nExpress started at http://localhost:' + app.get('port') + '\npress ctrl-C to terminate.\n');
});
