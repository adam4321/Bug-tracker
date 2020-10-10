/*************************************************************
**  Description: PROJECTS PAGE - server side node.js routes
**
**  Root path:   localhost:5000/bug_tracker/projects
**
**  Contains:    /
**               /insertProject
**************************************************************/

const express = require('express');
const router = express.Router();


// RENDER PROJECTS PAGE - Function to render the project page
function renderProjects(req, res, next) {
    // Find all of the projects and their associated companies
    let sql_query_2 = `SELECT * FROM Projects AS p JOIN Companies AS c ON p.companyId = c.companyId`;
    let sql_query_1 = `SELECT companyId, companyName FROM Companies`;

    const mysql = req.app.get('mysql');
    let context = {};

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
            res.render('add-project', context);
        });
    });
}


// PROJECTS PAGE INSERT NEW PROJECT - Route to insert a new project
function submitProject(req, res, next) {
    // Insert the form data into the Projects table
    let sql_query = `INSERT INTO Projects (projectName, companyId, dateStarted, lastUpdated, inMaintenance)
                        VALUES (?, (SELECT companyId FROM Companies WHERE companyName = ?), ?, ?, ?)`;
    
    const mysql = req.app.get('mysql');
    let context = {};

    mysql.pool.query(sql_query, [
            req.body.projectName,
            req.body.companyName,
            req.body.dateStarted,
            req.body.lastUpdated,
            req.body.inMaintenance
        ], (err, result) => {
            if (err) {
                next(err);
                return;
            }
            
            context.projects = result.insertId;
            res.send(JSON.stringify(context));
        });
}


/* PROJECTS PAGE ROUTES ---------------------------------------------------- */

router.get('/', renderProjects);
router.post('/insertProject', submitProject);

module.exports = router;
