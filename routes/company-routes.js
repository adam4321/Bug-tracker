/******************************************************************************
**  Description: COMPANIES PAGE - server side node.js routes
**
**  Root path:   localhost:5000/bug_tracker/companies
**
**  Contains:    /
**               /deleteCompany
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
    let sql_query = `SELECT * FROM Companies ORDER BY dateJoined DESC, companyId DESC`;

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


/* COMPANIES PAGE ROUTES ----------------------------------------------------- */

router.get('/', checkUserLoggedIn, displayCompanyPage);
router.post('/deleteCompany', checkUserLoggedIn, deleteCompany);

module.exports = router;
