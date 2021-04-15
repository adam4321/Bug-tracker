/******************************************************************************
**  Description: ALL BUGS PAGE - server side node.js routes
**
**  Root path:   localhost:5000/bug_tracker/all_bugs
**
**  Contains:    /
**               /deleteBug
**               /searchBug
**               /viewAllBugs
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
function renderHome(req, res, next) {

    // 3rd query populates the bug list
    let sql_query = `SELECT p.firstName, p.lastName, b.bugId, pj.projectName, b.bugSummary, b.bugDescription, 
                        b.dateStarted, b.resolution, b.priority, b.fixed 
	                    FROM Programmers p 
		                JOIN Bugs_Programmers bp ON p.programmerId = bp.programmerId
		                JOIN Bugs b ON bp.bugId = b.bugId
                        LEFT OUTER JOIN Projects pj ON b.projectId <=> pj.projectId
                            ORDER BY dateStarted DESC`;

    const mysql = req.app.get('mysql');                 

    // Initialize empty context object with Google user props
    let context = {};
    context.id = req.user.id;
    context.email = req.user.email;
    context.name = req.user.displayName;
    context.photo = req.user.picture;
    context.accessLevel = req.session.accessLevel;

    // Populate the bug list
    mysql.pool.query(sql_query, (err, rows) => {
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

        // After the call returns, then populate the context array
        context.bugs = bugsDbData;
        res.render('all-bugs', context);
    });
}


/* ALL BUGS PAGE DELETE ROW - Route to delete a row from the bug list ----- */
function deleteBug(req, res, next) {
    // Delete the row with the passed in bugId
    let sql_query_1 = `DELETE FROM Bugs WHERE bugId=?`;

    let sql_query_2 = `SELECT * FROM Bugs`;

    const mysql = req.app.get('mysql');
    var context = {};

    mysql.pool.query(sql_query_1, [req.body.bugId], (err, result) => {
        if (err) {
            next(err);
            return;
        }

        mysql.pool.query(sql_query_2, (err, rows) => {
            if (err) {
                next(err);
                return;
            }
            context.results = JSON.stringify(rows);
            res.render('all-bugs', context);
        });
    });
}


/* BUGS PAGE SEARCH BUG - Function to search for string in bugs table ----- */
function searchBug(req, res, next) {
    // query to find bug entries that contain substring
    let searchQuery = 'SELECT bugId FROM Bugs WHERE CONCAT(bugSummary, bugDescription, resolution) LIKE "%' + 
                        req.body.searchString + '%"';

    const mysql = req.app.get('mysql');                 
    let context = {};
    
    mysql.pool.query(searchQuery, (err, result) => {
        if (err) {
            next(err);
            return;
        }

        // if no results were found in initial search query
        if (result.length == 0) {
            context.bugs = [];
            res.send(JSON.stringify(context));
            return;
        }

        // Get list of matching bugIds 
        resultsList = [];
        for(i = 0; i < result.length; i++) {
            resultsList.push(result[i].bugId)
        }
        idString = resultsList.join();

        // query to gather data of bugs in the initial query results
        let bugsQuery = `SELECT p.firstName, p.lastName, b.bugId, pj.projectName, b.bugSummary, b.bugDescription,
                            b.dateStarted, b.resolution, b.priority, b.fixed FROM Programmers p
                            JOIN Bugs_Programmers bp ON p.programmerId = bp.programmerId
                            JOIN Bugs b ON bp.bugId = b.bugId
                            LEFT OUTER JOIN Projects pj ON b.projectId = pj.projectId
                                WHERE b.bugId IN (${idString})
                                ORDER BY dateStarted DESC`;

        // console.log(bugsQuery)  // this string can be pasted in phpmyadmin for testing

        mysql.pool.query(bugsQuery, (err, rows) => {
            if (err) {
                next(err);
                return;
            }

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
    });
}


/* BUGS PAGE VIEW ALL BUGS - Function to redisplay all bugs --------------- */
function viewAllBugs(req, res, next) {
    let viewAllQuery = `SELECT p.firstName, p.lastName, b.bugId, pj.projectName, b.bugSummary, b.bugDescription, 
                        b.dateStarted, b.resolution, b.priority, b.fixed 
	                    FROM Programmers p 
		                JOIN Bugs_Programmers bp ON p.programmerId = bp.programmerId
		                JOIN Bugs b ON bp.bugId = b.bugId
                        LEFT OUTER JOIN Projects pj ON b.projectId <=> pj.projectId
                            ORDER BY dateStarted DESC`;

    const mysql = req.app.get('mysql');                 
    let context = {};
    
    mysql.pool.query(viewAllQuery, (err, result) => {
        if (err) {
            next(err);
            return;
        }

        // if no results were found in initial search query
        if (result.length == 0) {
            context.bugs = [];
            res.send(JSON.stringify(context));
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
}


/* PROJECTS PAGE ROUTES ---------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderHome);
router.post('/deleteBug', checkUserLoggedIn, deleteBug);
router.post('/searchBug', checkUserLoggedIn, searchBug);
router.post('/viewAllBugs', checkUserLoggedIn, viewAllBugs);

module.exports = router;
