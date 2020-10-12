/******************************************************************************
**  Description: HOME PAGE - USER BUGS - server side node.js routes
**
**  Root path:  localhost:5000/bug_tracker/home
**
**  Contains:   /
**              /add-user
**              /update-account
**              /update-user
**              /login-redirect
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn
******************************************************************************/

const express = require('express');
const router = express.Router();


/* USER BUGS - Function to render user's bugs ------------------------------ */
function renderHome(req, res) {
    const sql_query_1 = `SELECT firstName, lastName, programmerId FROM Programmers WHERE programmerId = ?`

    // 2nd query populates the bug list
    const sql_query_2 = `SELECT p.firstName, p.lastName, b.bugId, pj.projectName, b.bugSummary, 
                        b.bugDescription, b.dateStarted, b.resolution, b.priority, b.fixed 
	                    FROM Programmers p
                        JOIN Bugs_Programmers bp ON p.programmerId = bp.programmerId  
                        JOIN Bugs b ON bp.bugId = b.bugId
                        LEFT OUTER JOIN Projects pj ON b.projectId <=> pj.projectId
                            WHERE p.programmerId = ?
                            ORDER BY bugId`;

    const mysql = req.app.get('mysql');

    // Initialize empty context array
    let context = {};
    context.user = req.user;
    console.log(context)

    // See if user with email at end of query string exists in database
    mysql.pool.query(sql_query_1, context.user.id, (err, rows, fields) => {
        if (err) {
           next(err);
           return;
        }
        
        // If the user does not exist in the database, render user-account page
        if (rows.length === 0) {
            res.render("user-account", context);
        }
	    
        // Otherwise, render user home page
        else {
            mysql.pool.query(sql_query_2, context.user.id, (err, rows) => {
                if (err) {
                    next(err);
                    return;
                }
        
                let prevEntryBugId;           // Cache the previous entry's id to avoid duplication
                let bugProgrammers = [];      // Hold the programmers for each entry
                let bugsDbData = [];          // Put the mysql data into an array for rendering
        
                for (let i in rows) {
                    // If this is the same entry as the last, then only add the programmer to the array
                    if (prevEntryBugId == rows[i].bugId) {
                        bugProgrammers.push(rows[i].firstName + ' ' + rows[i].lastName);
                    }
                    // This is a new entry
                    else {
                        prevEntryBugId = rows[i].bugId;         // Cache the bugId
                        bugProgrammers = [];                    // Add the programmer to the array
                        bugProgrammers.push(rows[i].firstName + ' ' + rows[i].lastName);
        
                        // Push a single entry
                        bugsDbData.push({
                            bugId: rows[i].bugId,
                            bugSummary: rows[i].bugSummary,
                            bugDescription: rows[i].bugDescription,
                            projectName: rows[i].projectName,
                            programmers: bugProgrammers,
                            dateStarted: rows[i].dateStarted,
                            priority: rows[i].priority,
                            fixed: rows[i].fixed,
                            resolution: rows[i].resolution
                        });
                    }
                }
                context.bugs = bugsDbData;
                res.render("user-home", context);
            });
	    }
    });
};


/* USER BUGS - Function to create new user in the database ----------------- */
function insertData(req, res, next) {
    const query = `INSERT INTO Programmers (programmerId, firstName, lastName, email, mobile_number, dateStarted, accessLevel)
                        VALUES (?, ?, ?, ?, ?, ?, ?)`
    const mysql = req.app.get('mysql');

    mysql.pool.query(query, 
        [
            req.user.id,
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


/* UPDATE USER SETTINGS - Function to render update account page ----------- */
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
            else {
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


/* UPDATE USER SETTINGS - Function to update settings for an existing user - */
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


/* USER BUGS - Function to display a redirection view ---------------------- */
function renderLogin(req, res) {
    res.render("login-redirect");
};


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


/* USER HOME PAGE ROUTES --------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderHome);
router.post('/add-user', checkUserLoggedIn, insertData);
router.get('/update-account', checkUserLoggedIn, renderUpdateForm);
router.post('/update-user', checkUserLoggedIn, updateData);
router.get('/login-redirect', checkUserLoggedIn, renderLogin);

module.exports = router;
