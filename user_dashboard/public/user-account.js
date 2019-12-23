/**********************************************************************************
**  Description:   Account setup page client side JavaScript
**********************************************************************************/


/**********************************************************************
** Make sure the email field constains something that appears to be in
** the form of an email address once DOM content is loaded. Otherwise,
** redirect to login screen. 
**********************************************************************/
document.addEventListener("DOMContentLoaded", verifyEmailFormat);

function verifyEmailFormat()
{
    var emailString = document.getElementById("user-email-field").value;
    if (emailString.indexOf("@") === -1)
    {
        window.location.replace("http://localhost:5000/login-redirect");
    }
}

// Override default action of submit button
document.getElementById("save").addEventListener("click", function(event) {
    event.preventDefault();
});


// Onclick function to process form data when user clicks "Save."
function insertUser(name, email, phone, birthday, subscribeArr, alertsArr) {
    // If user did not enter name, display error message and return
    if (name === "") {
        alert("The name field cannot be left blank.");
        return;
    }
    
    // If user did not enter phone number, set to NULL
    if (phone === "") {
        phone = null;
    }
    
    // If user did not enter birthday, display error message and return
    if (birthday === "") {
        alert("The birthday field cannot be left blank.");
        return;
    }
    
    // Determine boolean value to assign to subscribe
    var subscribe;
    if (subscribeArr[0].checked) {
        subscribe = 1;
    }
    else {
        subscribe = 0;
    }
    
    // Determine boolean value to assign to alerts
    var alerts;
    if (alertsArr[0].checked) {
        alerts = 1;
        if (phone === null)
        {
                alert("You must enter a phone number if you choose to receive text alerts.");
                return;
        }
    }
    else {
        alerts = 0;
    }
    
    // Make AJAX request to server to add data
    var req = new XMLHttpRequest();
    req.open("POST", "http://localhost:5000/add-user", true);
    req.setRequestHeader("Content-Type", "application/json");
    
    var reqBody = {
        "name":name,
        "email":email,
        "phone":phone, 
        "birthday":birthday, 
        "subscribe":subscribe,
        "alerts":alerts
    };
    
    reqBody = JSON.stringify(reqBody);
    
    // Callback function for once request returns
    req.addEventListener("load", function redirectHome() {
        if (req.status >= 200 && req.status < 400) {
            var homeAddr = "http://localhost:5000/?uid=" + encodeURIComponent(email);
            window.location.replace(homeAddr);
        }
        else {
            alert("An error occurred posting data to the server.");
        }
    });
    
    req.send(reqBody);
}