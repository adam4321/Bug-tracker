/*************************************************************
**  Description: USER HOME PAGE - server side node.js routes
**
**  Contains:    /

**************************************************************/

const express = require('express');
const router = express.Router();


// Create route for simple get request to render the home page.
function renderHome(req, res) {
    const query = `SELECT firstName, lastName, programmerId FROM Programmers WHERE programmerId = ?`
    const mysql = req.app.get('mysql');

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
};


// Create route to create new user in the database
function insertData(req, res, next) {
    const query = `INSERT INTO Programmers (programmerId, firstName, lastName, email, mobile_number, dateStarted, accessLevel)
                        VALUES (?, ?, ?, ?, ?, ?, ?)`
    const mysql = req.app.get('mysql');

    mysql.pool.query(query, 
        [
            req.body.uid,
            req.body.firstName,
            req.body.lastName,
            req.body.email, 
            req.body.mobile_number, 
            req.body.dateStarted, 
            req.body.accessLevel
        ], 
        function(err, result) {
            if (err) {
                next(err);
                return;
            }
        
            res.end()
        }
    );
};


// Create route for get request to render update account page
function renderUpdateForm(req, res) {
    const query = `SELECT programmerId, firstName, lastName, email, mobile_number, dateStarted, accessLevel
                    FROM Programmers
                    WHERE programmerId = ?`
    const mysql = req.app.get('mysql');

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
                let context = [];
            
                // Fill context array
                context.uid = req.query.uid;
                context.firstName = rows[0].firstName;
                context.lastName = rows[0].lastName;
                context.email = rows[0].email;
                context.phone = rows[0].mobile_number;
                context.dateStarted = rows[0].dateStarted;
                context.accessLevel = rows[0].accessLevel;

                // Render update account page
                res.render("update-account", context); 
            }
        }
    );
};


// Create route to update information for an existing user in the database
function updateData(req, res, next) {
    const query = `UPDATE Programmers SET firstName = ?, lastName = ?, email = ?, mobile_number = ?, dateStarted = ?
                    WHERE programmerId = ?`
    const mysql = req.app.get('mysql');
    
    mysql.pool.query(query, 
        [
            req.body.firstName,
            req.body.lastName,
            req.body.email,
            req.body.mobile_number, 
            req.body.dateStarted, 
            req.body.uid 
        ], 
        function(err, result) {
            if (err) {
                next(err);
                return;
            }
            
            res.end()
        }
    );
};


// Create route for serving login redirection page if script sends users here
function renderLogin(req, res) {
    res.render("login-redirect");
};


/* USER HOME PAGE ROUTES --------------------------------------------------- */

router.get('/', renderHome);
router.post('/add-user', insertData);
router.get('/update-account', renderUpdateForm);
router.post('/update-user', updateData);
router.get('/login-redirect', renderLogin);

module.exports = router;