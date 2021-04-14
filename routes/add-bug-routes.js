/******************************************************************************
**  Description: ADD BUG PAGE - server side node.js routes
**
**  Root path:   localhost:5000/bug_tracker/add_bug
**
**  Contains:    /
**               /insertBug
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn
******************************************************************************/

const express = require('express');
const router = express.Router();


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


/* RENDER ALL BUGS PAGE - Function to render the bugs page ----------------- */
function renderAddBug(req, res, next) {
    // 1st query gathers the projects for the dropdown
    let sql_query_1 = `SELECT projectName, projectId FROM Projects`;

    // 2nd query gathers the programmers for the scrolling checkbox list
    let sql_query_2 = `SELECT programmerId, firstName, lastName FROM Programmers`;

    const mysql = req.app.get('mysql');                 

    // Initialize empty context object with Google user props
    let context = {};
    context.id = req.user.id;
    context.email = req.user.email;
    context.name = req.user.displayName;
    context.photo = req.user.picture;
    context.accessLevel = req.session.accessLevel;

    // Query for the list of programmers
    mysql.pool.query(sql_query_2,  (err, rows) => {
        if (err) {
            next(err);
            return;
        }

        let programmersDbData = [];
        
        for (let i in rows) {
            programmersDbData.push({
                programmerId: rows[i].programmerId,
                firstName: rows[i].firstName,
                lastName: rows[i].lastName
            });
        }

        // Query for the list of projects
        mysql.pool.query(sql_query_1,  (err, rows) => {
            if (err) {
                next(err);
                return;
            }
            
            let projectDbData = [];

            for (let i in rows) {
                projectDbData.push({
                    projectName: rows[i].projectName,
                    projectId: rows[i].projectId
                });
            }

            // After the 2 calls return, then populate the context array
            context.programmers = programmersDbData;
            context.projects = projectDbData;
            res.render('add-bug', context);
        });
    });
}


/* INSERT NEW BUG PAGE - Function to insert a new bug --------------------- */
function submitBug(req, res, next) {
    // Query to insert the bug data
    let sql_query_1 = `INSERT INTO Bugs (bugSummary, bugDescription, projectId, dateStarted, priority, fixed, resolution) 
                            VALUES (?, ?, ?, ?, ?, ?, ?)`;

    // Query to run in loop to create Bugs_Programmers instances
    let sql_query_2 = `INSERT INTO Bugs_Programmers (bugId, programmerId) 
                            VALUES (?, ?)`;

    const mysql = req.app.get('mysql');
    let context = {};
    let bugId;

    // Insert new bug data
    mysql.pool.query(sql_query_1, [
        req.body.bugSummary,
        req.body.bugDescription,
        req.body.bugProject,
        req.body.bugStartDate,
        req.body.bugPriority,
        req.body.bugFixed,
        req.body.bugResolution
    ], (err, result) => {
        if (err) {
            next(err);
            return;
        }

        // Retrieve the bugId from the previous query's result
        bugId = result.insertId;

        // Run the Bugs_Programmers insertion for each programmer
        for (let i in req.body.programmerArr) {
            mysql.pool.query(sql_query_2, [result.insertId, req.body.programmerArr[i]], (err, result) => {
                if (err) {
                    next(err);
                    return;
                }
            });
        }

        context.id = bugId;
        context.bugs = result.insertId;
        res.send(JSON.stringify(context));
    });
}


/* PROJECTS PAGE ROUTES ---------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderAddBug);
router.post('/insertBug', checkUserLoggedIn, submitBug);

module.exports = router;
