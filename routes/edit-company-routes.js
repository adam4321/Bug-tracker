/******************************************************************************
**  Description: EDIT_COMPANY PAGE - server side node.js routes
**
**  Root path:   localhost:5000/bug_tracker/edit_company
**
**  Contains:    /
**               /updateCompany
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn
******************************************************************************/

const express = require('express');
const router = express.Router();


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
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

router.get('/', checkUserLoggedIn, displayEditCompanyPage);
router.post('/updateCompany', checkUserLoggedIn, updateCompany);

module.exports = router;
