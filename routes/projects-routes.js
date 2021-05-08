/******************************************************************************
**  Description: PROJECTS PAGE - server side node.js routes
**
**  Root path:   localhost:5000/bug_tracker/projects
**
**  Contains:    /
**               /deleteProject
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn
******************************************************************************/

const express = require('express');
const router = express.Router();


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


/* RENDER PROJECTS PAGE - Function to render the project page -------------- */
function renderProjects(req, res, next) {
    // Find all of the projects and their associated companies
    let sql_query_1 = `SELECT companyId, companyName FROM Companies`;
    
    let sql_query_2 = `SELECT * FROM Projects AS p JOIN Companies AS c ON p.companyId = c.companyId
                            ORDER BY dateStarted DESC, projectId DESC`;

    const mysql = req.app.get('mysql');
    
    // Initialize empty context object with Google user props
    let context = {};
    context.id = req.user.id;
    context.email = req.user.email;
    context.name = req.user.displayName;
    context.photo = req.user.picture;
    context.accessLevel = req.session.accessLevel;

    // Query projects
    mysql.pool.query(sql_query_2, (err, rows) => {
        if (err) {
            next(err);
            return;
        }
        
        // Put the mysql data into an array for rendering 
        let projectDbData = [];
        for (let i in rows) {
            projectDbData.push({
                projectId: rows[i].projectId,
                projectName: rows[i].projectName,
                companyName: rows[i].companyName,
                dateStarted: rows[i].dateStarted,
                lastUpdated: rows[i].lastUpdated,
                inMaintenance: rows[i].inMaintenance
            });
        }

        // Query for the list of companies
        mysql.pool.query(sql_query_1,  (err, rows) => {
            if (err) {
                next(err);
                return;
            }
            let companyDbData = [];
            for (let i in rows) {
                companyDbData.push({
                    companyId: rows[i].companyId,
                    companyName: rows[i].companyName
                });
            }
            
            // After the 2 calls return, then populate the context array
            context.companies = companyDbData;
            context.projects = projectDbData;
            res.render('projects', context);
        });
    });
}


/* PROJECTS PAGE DELETE - Route to delete a row from the projects list ----- */
function deleteProject(req, res, next) {
    // Delete the row with the passed in bugId
    let sql_query_1 = `DELETE FROM Projects WHERE projectId=?`;
    let sql_query_2 = `SELECT * FROM Projects`;

    const mysql = req.app.get('mysql');
    var context = {};

    mysql.pool.query(sql_query_1, [req.body.projectId], (err, result) => {
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
            res.render('projects', context);
        });
    });
}


/* PROJECTS PAGE ROUTES ---------------------------------------------------- */

router.get('/', checkUserLoggedIn, renderProjects);
router.post('/deleteProject', checkUserLoggedIn, deleteProject);

module.exports = router;
