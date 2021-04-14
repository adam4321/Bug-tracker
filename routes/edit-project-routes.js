/******************************************************************************
**  Description: EDIT_PROJECT PAGE - server side node.js routes
**
**  Root path:   localhost:5000/bug_tracker/edit_project
**
**  Contains:    /
**               /updateProject
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn
******************************************************************************/

const express = require('express');
const router = express.Router();


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


/* RENDER EDIT PROJECTS PAGE - Function to render the edit project page ---- */
function renderEditProject(req, res, next) {
    // Find all of the projects and their associated companies
    let sql_query_1 = `SELECT companyId, companyName FROM Companies`;
    let sql_query_2 = `SELECT c.companyName, p.projectName, p.dateStarted, p.lastUpdated, p.inMaintenance
                        FROM Projects p JOIN Companies c ON p.companyId = c.companyId
                        WHERE p.projectId = ?`;

    const mysql = req.app.get('mysql');
    
    // Initialize empty context object with Google user props
    let context = {};
    context.id = req.user.id;
    context.email = req.user.email;
    context.name = req.user.displayName;
    context.photo = req.user.picture;
    context.accessLevel = req.session.accessLevel;

    // Query projects
    mysql.pool.query(sql_query_2, [req.query.projectId], (err, rows) => {
        if (err) {
            next(err);
            return;
        }
        
        // Add project data to context object
        context.projectId = rows[0].projectId;
        context.projectName = rows[0].projectName;
        context.companyName = rows[0].companyName;
        context.dateStarted = rows[0].dateStarted;
        context.lastUpdated = rows[0].lastUpdated;
        context.inMaintenance = rows[0].inMaintenance;

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
            
            // Add company array to context object
            context.companies = companyDbData;

            res.render('edit-project', context);
        });
    });
}


/* PROJECTS PAGE UPDATE PROJECT - Route to update a project ---------------- */
function submitUpdateProject(req, res, next) {
    // Update the project instance
    let sql_query = `UPDATE Projects SET 
                    projectName=?, companyId=(SELECT companyId FROM Companies WHERE companyName=?), dateStarted=?, lastUpdated=?, inMaintenance=?
                    WHERE projectId=?`;
    
    const mysql = req.app.get('mysql');
    let context = {};

    mysql.pool.query(sql_query, [
        req.body.projectName,
        req.body.companyName,
        req.body.dateStarted,
        req.body.lastUpdated,
        req.body.inMaintenance,
        req.body.projectId
    ], (err, result) => {
        if (err) {
            next(err);
            return;
        }
        
        context.projects = result.insertId;
        res.send(JSON.stringify(context));
    });
}


/* EDIT_PROJECT PAGE ROUTES ------------------------------------------------ */

router.get('/', checkUserLoggedIn, renderEditProject);
router.post('/updateProject', checkUserLoggedIn, submitUpdateProject);

module.exports = router;
