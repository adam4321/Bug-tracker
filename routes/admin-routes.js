/******************************************************************************
**  Description: UPDATE ACCOUNT PAGE - server side node.js routes
**
**  Root path:   localhost:5000/bug_tracker/settings
**
**  Contains:    /
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

    res.render("admin", context);
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
router.post('/resetTable', checkUserLoggedIn, resetTable);

module.exports = router;
