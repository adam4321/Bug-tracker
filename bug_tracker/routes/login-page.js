/******************************************************************************
**  Description: LOGIN PAGE - server side node.js routes
**
**  Root path:   localhost:5000/bug_tracker/login
**
**  Contains:    /
**
******************************************************************************/

const express = require('express');
const router = express.Router();


// COMPANIES PAGE RENDER - function to view all existing companies
function renderLoginPage(req, res, next) {

    let context = {};

    res.render('login-page', context);
}




/* LOGIN PAGE ROUTES ----------------------------------------------------- */

router.get('/', renderLoginPage);

module.exports = router;
