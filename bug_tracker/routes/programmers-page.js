/*************************************************************
**  Description: PROGRAMMERS PAGE - server side node.js routes
**
**  Contains:    /programmers/
**               /programmers/insertProgrammer
**************************************************************/

const express = require('express');
const router = express.Router();


// RENDER PROGRAMMER PAGE - Function to render the programmers page
function renderProgrammers(req, res, next) {
    // Find all of the programmers
    let sql_query = `SELECT * FROM Programmers`;

    const mysql = req.app.get('mysql');
    let context = {};

    mysql.pool.query(sql_query, (err, rows) => {
        if (err) {
            next(err);
            return;
        }

        // Put the mysql data into an array for rendering
        let programmersDbData = [];
        for (let i in rows) {
            programmersDbData.push({
                firstName: decodeURIComponent(rows[i].firstName),
                lastName: decodeURIComponent(rows[i].lastName),
                email: decodeURIComponent(rows[i].email),
                dateStarted: rows[i].dateStarted,
                accessLevel: rows[i].accessLevel
            });
        }
        context.programmers = programmersDbData;
        res.render('add-programmer', context);
    })
}


// PROGRAMMERS PAGE INSERT NEW PROGRAMMER - Function to insert a new programmer
function submitProgrammer(req, res, next) {
    // Insert the form data into the Programmers table
    let sql_query = `INSERT INTO Programmers (firstName, lastName, email, dateStarted, accessLevel) 
                        VALUES (?, ?, ?, ?, ?)`;

    const mysql = req.app.get('mysql');
    let context = {};

    mysql.pool.query(sql_query, [
        req.body.firstName,
        req.body.lastName, 
        req.body.email, 
        req.body.dateStarted, 
        req.body.accessLevel
    ], (err, result) => {
        if (err) {
            next(err);
            return;
        }

        context.programmers = result.insertId;
        res.send(JSON.stringify(context));
    });
}


/* PROGRAMMERS PAGE ROUTES ---------------------------------------------------- */

router.get('/', renderProgrammers);
router.post('/insertProgrammer', submitProgrammer);

module.exports = router;
