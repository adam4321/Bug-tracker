/******************************************************************************
**  Description: UPDATE ACCOUNT PAGE - server side node.js routes
**
**  Root path:   localhost:5000/bug_tracker/settings
**
**  Contains:    /
**               /resetTable
**              
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn 
******************************************************************************/

const express = require('express');
const router = express.Router();


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


/* RENDER SETTINGS PAGE - Function to render the login page ---------------- */
function renderSettings(req, res, next) {    
    // Initialize empty context object with Google user props
    let context = {};
    context.id = req.user.id;
    context.email = req.user.email;
    context.name = req.user.displayName;
    context.photo = req.user.picture;
    context.accessLevel = req.session.accessLevel;

    res.render("admin", context);
};


/* BUGS PAGE RESET TABLES - Function to drop and repopulate database ------ */
function resetTable(req, res, next) {
    // Import the reset query from file
    let recreateQuery = require('../sql/reset_database.js');
    const mysql = req.app.get('mysql');                 
    
    mysql.pool.query(recreateQuery, (err, result) => {
        if(err) {
            next(err);
            return;
        }

        res.send(JSON.stringify(result));
    });
}


/* UPDATE ACCOUNT PAGE ROUTES ---------------------------------------------- */

router.get('/', checkUserLoggedIn, renderSettings);
router.post('/resetTable', checkUserLoggedIn, resetTable);

module.exports = router;
