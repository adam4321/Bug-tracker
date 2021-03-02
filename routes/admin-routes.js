/******************************************************************************
**  Description: UPDATE ACCOUNT PAGE - server side node.js routes
**
**  Root path:   localhost:5000/bug_tracker/settings
**
**  Contains:    /
**               /update-user
**               /resetTable
**              
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn 
******************************************************************************/

const express = require('express');
const router = express.Router();


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


/* RENDER SETTINGS PAGE - Function to render the login page ---------------- */
function renderSettings(req, res, next) {    
    // Initialize empty context object with Google user props
    let context = {};
    context.id = req.user.id;
    context.email = req.user.email;
    context.name = req.user.displayName;
    context.photo = req.user.picture;
    context.accessLevel = req.session.accessLevel;

    res.render("update-account", context);
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


/* BUGS PAGE RESET TABLES - Function to drop and repopulate database ------ */
function resetTable(req, res, next) {
    // Query to display the table after reset
    let viewAllQuery = `SELECT p.firstName, p.lastName, b.bugId, pj.projectName, b.bugSummary, b.bugDescription, 
                        b.dateStarted, b.resolution, b.priority, b.fixed 
                        FROM Programmers p 
                        JOIN Bugs_Programmers bp ON p.programmerId = bp.programmerId
                        JOIN Bugs b ON bp.bugId = b.bugId
                        LEFT OUTER JOIN Projects pj ON b.projectId <=> pj.projectId
                            ORDER BY bugId`;

    let recreateQuery = require('../sql/reset_database.js');
    const mysql = req.app.get('mysql');                 
    
    mysql.pool.query(recreateQuery, (err, result) => {
        if(err) {
            next(err);
            return;
        }

        const mysql = req.app.get('mysql');                 
        let context = {};

        mysql.pool.query(viewAllQuery, (err, result) => {
            if(err) {
                next(err);
                return;
            }

            let rows = result;
            let prevEntryBugId;
            let bugProgrammers = [];
            let matchingBugsData = [];

            for (let i in rows) {
                if (prevEntryBugId == rows[i].bugId) {
                    bugProgrammers.push(rows[i].firstName + ' ' + rows[i].lastName);
                }
                else {
                    prevEntryBugId = rows[i].bugId;
                    bugProgrammers = [];
                    bugProgrammers.push(rows[i].firstName + ' ' + rows[i].lastName);

                    matchingBugsData.push({
                        bugId: rows[i].bugId,
                        bugSummary: rows[i].bugSummary,
                        bugDescription: rows[i].bugDescription,
                        projectName: rows[i].projectName,
                        programmers: bugProgrammers,
                        dateStarted: rows[i].dateStarted,
                        priority: rows[i].priority,
                        fixed: rows[i].fixed,
                        resolution: rows[i].resolution
                    }) 
                }
            }

            context.bugs = matchingBugsData;
            res.send(JSON.stringify(context));
        });
    })
}


/* UPDATE ACCOUNT PAGE ROUTES ---------------------------------------------- */

router.get('/', checkUserLoggedIn, renderSettings);
router.get('/update-account', checkUserLoggedIn, renderUpdateForm);
router.post('/update-user', checkUserLoggedIn, updateData);
router.post('/resetTable', checkUserLoggedIn, resetTable);

module.exports = router;
