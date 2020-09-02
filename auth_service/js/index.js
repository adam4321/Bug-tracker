/*******************************************************
** Description:  Authentication service which signs up
**               users and then sends them to a backend 
**               service on another url when logged in
*******************************************************/

/************************************
** Handles the sign in button press
*************************************/
function toggleSignIn() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
            alert('Please enter an email address.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a password.');
            return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            document.getElementById('sign-in').disabled = false;
            // [END_EXCLUDE]
        });
        // [END authwithemail]
    }
    document.getElementById('sign-in').disabled = true;
}


/*************************************
** Handles the sign up button press
**************************************/
function handleSignUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        return;
    }
    // Sign in with email and passord
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END createwithemail]
}


/*********************************************
** Sends password reset email to the user
*********************************************/
function sendPasswordReset() {
    var email = document.getElementById('email').value;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function() {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert('Password Reset Email Sent!');
        // [END_EXCLUDE]
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
            alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
}


/**********************************************************************************************
** initApp handles setting up UI event listeners and registering Firebase auth listeners:
**  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
**    out, and that is where we update the UI.
**********************************************************************************************/
function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User clicks the sign in button
            // [START_EXCLUDE]
            document.getElementById('sign-in-status').textContent = 'Signed in';   

            // Create query string for GET request
            let currentUser = {uid: user.uid};
            console.log(user);
            currentUser = new URLSearchParams(currentUser).toString();

            // URL with query string
            let url = "http://localhost:5000/?" + currentUser;

            
            // Test auth service
            console.log(url)
            document.getElementById('sign-in').textContent = 'Sign out';


            // Clear out user and sign-out before changing URL
            user = null;
            toggleSignIn();

            // Change URL to user backend node server
            window.location.href = url;
            // [END_EXCLUDE]

        } else {
            // User is signed out.
            // [START_EXCLUDE]
            document.getElementById('sign-in-status').textContent = 'Signed out';
            document.getElementById('sign-in').textContent = 'Sign in';
            // [END_EXCLUDE]
        }
        // [START_EXCLUDE silent]
        document.getElementById('sign-in').disabled = false;
        // [END_EXCLUDE]
    });
    // [END authstatelistener]
    document.getElementById('sign-in').addEventListener('click', toggleSignIn, false);
    document.getElementById('sign-up').addEventListener('click', handleSignUp, false);
    document.getElementById('password-reset').addEventListener('click', sendPasswordReset, false);
}

window.onload = function() {
    firebase.auth().signOut();
    initApp();
}