/******************************************************************************
**  Description: EDIT_PROGRAMMER PAGE - server side node.js routes
**
**  Root path:   localhost:5000/bug_tracker/edit_programmer
**
**  Contains:    /
**               /updateProgrammer
**
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn
******************************************************************************/

const express = require('express');
const router = express.Router();


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


/* RENDER EDIT_PROGRAMMER PAGE - Function to render edit programmer page --- */
function renderEditProgrammer(req, res, next) {
    // Find all of the programmers
    let sql_query = `SELECT firstName, lastName, email, mobile_number, dateStarted, accessLevel FROM Programmers
                        WHERE programmerId = ?`;

    const mysql = req.app.get('mysql');
    
    // Initialize empty context object with Google user props
    let context = {};
    context.id = req.user.id;
    context.email = req.user.email;
    context.name = req.user.displayName;
    context.photo = req.user.picture;
    context.accessLevel = req.session.accessLevel;

    mysql.pool.query(sql_query, [req.query.programmerId], (err, rows) => {
        if (err) {
            next(err);
            return;
        }

        // Put the mysql data into context object for rendering
        context.firstName = decodeURIComponent(rows[0].firstName);
        context.lastName = decodeURIComponent(rows[0].lastName);
        context.email = decodeURIComponent(rows[0].email);
        context.phone = rows[0].mobile_number;
        context.dateStarted = rows[0].dateStarted;
        context.accLvl = rows[0].accessLevel;

        res.render('edit-programmer', context);
    })
}


/* PROGRAMMERS PAGE UPDATE PROGRAMMER - Route to update a programmer ------- */
function submitUpdateProgrammer(req, res, next) {
    // Update the project instance
    let sql_query = `UPDATE Programmers SET 
                        firstName=?, lastName=?, email=?, mobile_number=?, dateStarted=?, accessLevel=?
                        WHERE programmerId=?`;
    
    const mysql = req.app.get('mysql');
    let context = {};

    mysql.pool.query(sql_query, [
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.mobile_number,
        req.body.dateStarted,
        req.body.accessLevel,
        req.body.programmerId
    ], (err, result) => {
        if (err) {
            next(err);
            return;
        }
        
        res.send(JSON.stringify(context));
    });
}


/* EDIT_PROGRAMMER PAGE ROUTES --------------------------------------------- */

router.get('/', checkUserLoggedIn, renderEditProgrammer);
router.post('/updateProgrammer', checkUserLoggedIn, submitUpdateProgrammer);

module.exports = router;
