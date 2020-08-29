/*************************************************************
**  Description: ADD PROJECT - Client-side JavaScript file
**************************************************************/

let recordForm = document.getElementById('recordForm');
let spinner = document.getElementById('spinner');
spinner.style.visibility = "hidden"; 

// Function to submit the form data
recordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    spinner.style.visibility = "visible";
    let req = new XMLHttpRequest();
    let path = '/projects/insertProject';

    // String that holds the form data
    let reqBody = {
        projectName: recordForm.elements.projectName.value,
        companyName: recordForm.elements.projectCompany.value,
        dateStarted: recordForm.elements.startedDate.value,
        lastUpdated: recordForm.elements.updatedDate.value,
        inMaintenance: recordForm.elements.maintenance.value
    };

    reqBody = JSON.stringify(reqBody);

    // Ajax request
    req.open('POST', path, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', () => {
        if (req.status >= 200 && req.status < 400) {
            let response = JSON.parse(req.responseText);
            let id = response.projects;

            // Table of database records for the added companies
            let tbl = document.getElementById('recordTable');
            let newRow = tbl.insertRow(-1);

            // Company Name element
            let nameCell = document.createElement('td');
            nameCell.textContent = recordForm.elements.projectName.value;
            nameCell.className = 'mdl-data-table__cell--non-numeric'; 
            newRow.appendChild(nameCell);
        
            // Date Joined element
            let companyCell = document.createElement('td');
            companyCell.textContent = recordForm.elements.projectCompany.value;
            companyCell.className = 'mdl-data-table__cell--non-numeric'; 
            newRow.appendChild(companyCell);

            // Date Joined element
            let startedCell = document.createElement('td');
            startedCell.textContent = recordForm.elements.startedDate.value;
            newRow.appendChild(startedCell);

            // Date Joined element
            let updatedCell = document.createElement('td');
            updatedCell.textContent = recordForm.elements.updatedDate.value;
            newRow.appendChild(updatedCell);

            // Date Joined element
            let maintenanceCell = document.createElement('td');

            // Test for in maintenance being 0 or 1 and set to yes or no
            if (recordForm.elements.maintenance.value == 1) {
                maintenanceCell.textContent = 'Yes';
            } 
            else {
                maintenanceCell.textContent = 'No';
            }
            newRow.appendChild(maintenanceCell);

            // Clear the submit form and turn off the spinner
            document.getElementById('recordForm').reset();
            setTimeout(() => { spinner.style.visibility = "hidden"; }, 1000);

        } else {
            console.error('Database return error');
        }
    });

    req.send(reqBody);
});
