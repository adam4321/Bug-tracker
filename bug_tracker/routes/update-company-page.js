/*************************************************************
**  Description: COMPANIES PAGE - server side node.js routes
**
**  Contains:    /companies
**               /companies/insertCompany
**************************************************************/

const express = require('express');
const router = express.Router();


// COMPANIES PAGE RENDER - function to view all existing companies
function displayCompanyPage(req, res, next) {
    // Find all of the current companies
    const mysql = req.app.get('mysql');
    let sql_query = `SELECT * FROM Companies`;
    let context = {};

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


// COMPANIES PAGE INSERT NEW COMPANY - function to insert a new company
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

router.get('/', displayCompanyPage);
router.post('/insertCompany', submitCompany);

module.exports = router;
