/******************************************************************************
**  Description: COMPANIES PAGES - server side node.js routes
**
**  Root path:   localhost:5000/bug_tracker/companies
**
**  Contains:    /
**               /add_company
**               /add_company/insertCompany
**               /deleteCompany
**               /edit_company
**               /edit_company/updateCompany
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn
******************************************************************************/

const express = require('express');
const router = express.Router();


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


/* COMPANIES PAGE RENDER - function to view all existing companies --------- */
function displayCompanyPage(req, res, next) {
    // Find all of the current companies
    const mysql = req.app.get('mysql');
    let sql_query = `SELECT * FROM Companies`;

    // Initialize empty context object with Google user props
    let context = {};
    context.id = req.user.id;
    context.email = req.user.email;
    context.name = req.user.displayName;
    context.photo = req.user.picture;
    context.accessLevel = req.session.accessLevel;

    mysql.pool.query(sql_query, (err, rows) => {
        if (err) {
            next(err);
            return;
        }

        // Put the mysql data into an array for rendering
        let companyDbData = [];
        for (let i in rows) {
            companyDbData.push({
                companyId: rows[i].companyId,
                companyName: rows[i].companyName,
                dateJoined: rows[i].dateJoined,
            });
        }
        context.companies = companyDbData;
        res.render('companies', context);
    });
}


/* ADD COMPANIES PAGE RENDER - function to view all existing companies ----- */
function displayAddCompanyPage(req, res, next) {
    // Find all of the current companies
    const mysql = req.app.get('mysql');
    let sql_query = `SELECT * FROM Companies`;

    // Initialize empty context object with Google user props
    let context = {};
    context.id = req.user.id;
    context.email = req.user.email;
    context.name = req.user.displayName;
    context.photo = req.user.picture;
    context.accessLevel = req.session.accessLevel;

    mysql.pool.query(sql_query, (err, rows) => {
        if (err) {
            next(err);
            return;
        }

        // Put the mysql data into an array for rendering
        let companyDbData = [];
        for (let i in rows) {
            companyDbData.push({
                companyId: rows[i].companyId,
                companyName: rows[i].companyName,
                dateJoined: rows[i].dateJoined,
            });
        }

        context.companies = companyDbData;
        res.render('add-company', context);
    });
}


/* COMPANIES PAGE INSERT NEW COMPANY - function to insert a new company ---- */
function submitCompany(req, res, next) {
    const mysql = req.app.get('mysql');
    let sql_query = `INSERT INTO Companies (companyName, dateJoined) VALUES (?, ?)`;
    let context = {};

    mysql.pool.query(sql_query, [req.body.companyName, req.body.dateJoined], (err, result) => {
        if (err) {
            next(err);
            return;
        }
        
        context.companies = result.insertId;
        res.send(JSON.stringify(context));
    });
}


/* EDIT COMPANY PAGE - Route where the edit company page is rendered ------- */
function displayEditCompanyPage(req, res, next) {
    // 1st query gathers the projects for the dropdown
    let sql_query = `SELECT companyName, dateJoined FROM Companies WHERE companyId = ?`;

    const mysql = req.app.get('mysql');
    
    // Initialize empty context object with Google user props
    let context = {};
    context.id = req.user.id;
    context.email = req.user.email;
    context.name = req.user.displayName;
    context.photo = req.user.picture;
    context.accessLevel = req.session.accessLevel;

    mysql.pool.query(sql_query, [req.query.companyId], (err, rows) => {
        if (err) {
            next(err);
            return;
        }

        context.companyId = req.query.companyId;
        context.companyName = rows[0].companyName;
        context.dateJoined = rows[0].dateJoined;

        res.render('edit-company', context);
    });
}


/* COMPANIES PAGE DELETE - Route to delete a row from the company list ----- */
function deleteCompany(req, res, next) {
    // Delete the row with the passed in bugId
    let sql_query_1 = `DELETE FROM Companies WHERE companyId=?`;
    let sql_query_2 = `SELECT * FROM Companies`;

    const mysql = req.app.get('mysql');
    var context = {};

    mysql.pool.query(sql_query_1, [req.body.companyId], (err, result) => {
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
            res.render('companies', context);
        });
    });
}


/* SUBMIT COMPANY EDIT - Function to submit a company update --------------- */
function updateCompany(req, res, next) {
    // Query to insert the bug data
    let sql_query = `UPDATE Companies SET companyName=?, dateJoined=? WHERE companyId = ?`;
    
    const mysql = req.app.get('mysql');

    // Insert updated bug data
    mysql.pool.query(sql_query, [
        req.body.companyName,
        req.body.dateJoined,
        req.body.companyId
    ], (err, result) => {
        if (err) {
            next(err);
            return;
        }

        res.end();
    });
}


/* COMPANIES PAGE ROUTES ----------------------------------------------------- */

router.get('/', checkUserLoggedIn, displayCompanyPage);
router.get('/add_company', checkUserLoggedIn, displayAddCompanyPage);
router.post('/add_company/insertCompany', checkUserLoggedIn, submitCompany);
router.post('/deleteCompany', checkUserLoggedIn, deleteCompany);
router.get('/edit_company', checkUserLoggedIn, displayEditCompanyPage);
router.post('/edit_company/updateCompany', checkUserLoggedIn, updateCompany);

module.exports = router;
