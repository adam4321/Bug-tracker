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
    // Gather the uid from the query string
    const uid = getUrlParameter('uid');
    
    // Make AJAX request to server to add data
    var req = new XMLHttpRequest();
    req.open("POST", "http://localhost:5000/bug_tracker/home/update-user", true);
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
            var homeAddr = "http://localhost:5000/bug_tracker/home";
            window.location.replace(homeAddr);
        }
        else {
            alert("An error occurred posting data to the server.");
        }
    });
    
    req.send(reqBody);
}


// Onclick function so that pressing "cancel" redirects to user dashboard with email appended to URL
function cancelEdit()
{
    var homeAddr = "http://localhost:5000/bug_tracker/home";
    window.location.replace(homeAddr);
}


/* RESET DATABASE CLIENT SIDE ---------------------------------------------- */

// Function to drop and repopulate all database tables
let resetBtn = document.getElementById("reset-table");
resetBtn.addEventListener('click', resetTable);
let spinner2 = document.getElementById('spinner2');
spinner2.style.visibility = "hidden";

function resetTable() {
    let path = "/bug_tracker/all_bugs/resetTable";
    let req = new XMLHttpRequest();

    // Prompt the user for a confirmation before resetting the db
    let confirmVal;
    confirmVal = confirm("This button RESETS the database and repopulates it with sample data!\n\nPress cancel to abort.");
    if (!confirmVal) {
        return;
    } else {
        // Display the spinner
        spinner2.style.visibility = "visible";

        // Make the ajax request
        req.open("POST", path, true);   
        req.setRequestHeader("Content-Type", "application/json");
        req.send(); 

        req.addEventListener("load", () => {
            if (req.status >= 200 && req.status < 400) {
                // Return the user to the bugs page
                window.location.href = "http://localhost:5000/bug_tracker/home";
            } 
            else {
                console.error("Reset table request error.");
            }
        })
    }
}
