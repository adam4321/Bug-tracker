/******************************************************************************
**  Description: ADD_COMPANY PAGE - server side node.js routes
**
**  Root path:   localhost:5000/bug_tracker/add_company
**
**  Contains:    /
**               /insertCompany
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn
******************************************************************************/

const express = require('express');
const router = express.Router();


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
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


/* COMPANIES PAGE ROUTES ----------------------------------------------------- */

router.get('/', checkUserLoggedIn, displayAddCompanyPage);
router.post('/insertCompany', checkUserLoggedIn, submitCompany);

module.exports = router;
