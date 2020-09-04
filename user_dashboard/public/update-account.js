/**********************************************************************************
**  Description:   Update account page client side JavaScript
**********************************************************************************/

// Add event listener to prevent default action of "save" button
document.getElementById("save").addEventListener("click", function(event) {
    event.preventDefault();
});


// Add event listener to prevent default action of "Cancel" button
document.getElementById("cancel").addEventListener("click", function(event) {
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
function updateUser(firstName, lastName, email, phone, dateStarted, accessLevel) {
    const uid = getUrlParameter('uid');
    // // If user deleted name and left field blank, display error message and return
    // if (name === "") {
    //     alert("The name field cannot be left blank.");
    //     return;
    // }
    
    // If user left phone field blank, set to NULL
    if (phone === "") {
        phone = null;
    }
    
    // // If user left birthday field blank, display error message and return
    // if (birthday === "") {
    //     alert("The birthday field cannot be left blank.");
    //     return;
    // }

    
    // Make AJAX request to server to add data
    var req = new XMLHttpRequest();
    req.open("POST", "http://localhost:5000/update-user", true);
    req.setRequestHeader("Content-Type", "application/json");
    
    var reqBody = {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "mobile_number": phone, 
        "dateStarted": dateStarted,
        "accessLevel": accessLevel
    };
    
    reqBody = JSON.stringify(reqBody);
    
    // Callback function for once request returns
    req.addEventListener("load", function redirectHome() {
        if (req.status >= 200 && req.status < 400) {
            var homeAddr = "http://localhost:5000/?uid=" + uid;
            window.location.replace(homeAddr);
        }
        else {
            alert("An error occurred posting data to the server.");
        }
    });
    
    req.send(reqBody);
}


// Onclick function so that pressing "cancel" redirects to user dashboard with email appended to URL
function cancelEdit(email)
{
    var homeAddr = "http://localhost:5000/?uid=" + getUrlParameter('uid');
    window.location.replace(homeAddr);
}