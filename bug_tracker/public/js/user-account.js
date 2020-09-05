/**********************************************************************************
**  Description:    Account setup page client side JavaScript
**********************************************************************************/


/*
** Make sure the email field constains something that appears to be in
** the form of an email address once DOM content is loaded. Otherwise,
** redirect to login screen. 
*/

// TODO: this needs to be changed to check uid instead of email

// document.addEventListener("DOMContentLoaded", verifyEmailFormat);

// function verifyEmailFormat()
// {
//     var emailString = document.getElementById("user-email-field").value;
//     if (emailString.indexOf("@") === -1)
//     {
//         window.location.replace("http://localhost:5000/login-redirect");
//     }
// }


// Override default action of submit button
document.getElementById("save").addEventListener("click", function(event) {
    event.preventDefault();
});

// Function to parse the query string
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};


// Onclick function to process form data when user clicks "Save."
function insertUser(firstName, lastName, email, phone, dateStarted, accessLevel) {
    // Get the user's unique ID
    const uid = getUrlParameter('uid');

    // // If user did not enter name, display error message and return
    // if (name === "") {
    //     alert("The name field cannot be left blank.");
    //     return;
    // }
    
    // // If user did not enter phone number, set to NULL
    // if (phone === "") {
    //     phone = null;
    // }
    
    // // If user did not enter birthday, display error message and return
    // if (birthday === "") {
    //     alert("The birthday field cannot be left blank.");
    //     return;
    // }
    

    
    // Make AJAX request to server to add data
    var req = new XMLHttpRequest();
    req.open("POST", "http://localhost:5000/add-user", true);
    req.setRequestHeader("Content-Type", "application/json");
    
    var reqBody = {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "mobile_number": phone, 
        "dateStarted": dateStarted,
        "accessLevel": accessLevel,
        "uid": uid
    };
    
    reqBody = JSON.stringify(reqBody);
    
    // Callback function for once request returns
    req.addEventListener("load", function redirectHome() {
        if (req.status >= 200 && req.status < 400) {
            var homeAddr = "http://localhost:5000/?uid=" + getUrlParameter('uid');
            window.location.replace(homeAddr);
        }
        else {
            alert("An error occurred posting data to the server.");
        }
    });
    
    req.send(reqBody);
}
