/******************************************************************************
**  Description: HOME PAGE - USER BUGS - server side node.js routes
**
**  Root path:  localhost:5000/bug_tracker/home
**
**  Contains:   /
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn
******************************************************************************/

const express = require('express');
const router = express.Router();


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


/* USER BUGS - Function to render user's bugs ------------------------------ */
function renderHome(req, res) {
    // Look for the Google authorized user in the database
    const sql_query_1 = `SELECT firstName, lastName, programmerId, email, mobile_number, dateStarted, accessLevel 
                        FROM Programmers 
                        WHERE programmerId = ?`

    // 2nd query populates the bug list
    const sql_query_2 = `SELECT p.firstName, p.lastName, b.bugId, pj.projectName, b.bugSummary, 
                        b.bugDescription, b.dateStarted, b.resolution, b.priority, b.fixed 
	                    FROM Programmers p
                        JOIN Bugs_Programmers bp ON p.programmerId = bp.programmerId  
                        JOIN Bugs b ON bp.bugId = b.bugId
                        LEFT OUTER JOIN Projects pj ON b.projectId <=> pj.projectId
                            WHERE p.programmerId = ?
                            ORDER BY bugId`;

    // Register the Google user into the database if they are a new user
    const sql_query_3 = `INSERT INTO Programmers 
                        (programmerId, firstName, lastName, email, mobile_number, dateStarted, accessLevel)
                        VALUES (?, ?, ?, ?, ?, ?, ?)`

    const mysql = req.app.get('mysql');

    // Initialize empty context object with Google user props
    let context = {};
    context.id = req.user.id;
    context.email = req.user.email;
    context.name = req.user.displayName;
    context.photo = req.user.picture;

    // See if user with email at end of query string exists in database
    mysql.pool.query(sql_query_1, context.id, (err, rows, fields) => {
        if (err) {
           next(err);
           return;
        }

        // If the user does not exist in the database, add them and render user-account page
        if (rows.length === 0) {
            // Get today's date
            const date = new Date();
            const formatted_date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

            // Insert the new user
            mysql.pool.query(sql_query_3, 
                [
                    context.id,
                    req.user.given_name,
                    req.user.family_name,
                    context.email, 
                    null, 
                    formatted_date,
                    3
                ], 
                (err, result) => {
                    if (err) {
                        next(err);
                        return;
                    }

                    // Add access level to the cookie session
                    req.session.accessLevel = 3;
                    context.accessLevel = 3;
                
                    // Then just render user home page, since a new user won't have bugs
                    res.render("your-bugs", context);
                }
            );
        }
        else {
            // Add access level to the cookie session and context object
            req.session.accessLevel = rows[0].accessLevel;
            context.accessLevel = rows[0].accessLevel;

            // Otherwise, find if the user has assigned bugs
            mysql.pool.query(sql_query_2, context.id, (err, rows) => {
                if (err) {
                    next(err);
                    return;
                }
        
                let prevEntryBugId;           // Cache the previous entry's id to avoid duplication
                let bugProgrammers = [];      // Hold the programmers for each entry
                let bugsDbData = [];          // Put the mysql data into an array for rendering
        
                for (let i in rows) {
                    // If this is the same bug as the last, then only add the programmer to the array
                    if (prevEntryBugId == rows[i].bugId) {
                        bugProgrammers.push(rows[i].firstName + ' ' + rows[i].lastName);
                    }
                    // This is a different bug than the last
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
                
                // Render user home page with any assigned bugs
                context.bugs = bugsDbData;
                res.render("your-bugs", context);
            });
        }
    });
};


/* USER HOME PAGE ROUTES --------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderHome);

module.exports = router;
