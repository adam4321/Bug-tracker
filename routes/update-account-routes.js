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
    
    // Test for the auth provider (Google vs Facebook) and create context object
    if (req.user.provider == 'google') {
        context.id = req.user.id;
        context.email = req.user.email;
        context.name = req.user.displayName;
        context.photo = req.user.picture;
    } else {
        context.id = req.user.id;
        context.email = req.user.emails[0].value;
        context.name = req.user.displayName;
        context.photo = req.user.photos[0].value;
    }

    res.render("update-account", context);
};


/* Middleware - Function to Check user is Logged in ------------------------ */
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.status(401).render('unauthorized-page', {layout: 'login'});
}


/* UPDATE ACCOUNT PAGE ROUTES ---------------------------------------------- */

router.get('/', checkUserLoggedIn, renderSettings);

module.exports = router;
