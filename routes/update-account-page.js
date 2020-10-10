/******************************************************************************
**  Description: UPDATE ACCOUNT PAGE - server side node.js routes
**
**  Root path:   localhost:5000/bug_tracker/settings
**
**  Contains:    /
**              
**  SECURED ROUTES!  --  All routes must call checkUserLoggedIn 
******************************************************************************/

const express = require('express');
const router = express.Router();


/* RENDER SETTINGS PAGE - Function to render the login page ---------------- */
function renderSettings(req, res, next) {
    let context = {};

    res.render("update-account", context);
};


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


/* UPDATE ACCOUNT PAGE ROUTES ---------------------------------------------- */

router.get('/', checkUserLoggedIn, renderSettings);

module.exports = router;
