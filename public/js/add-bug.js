/*************************************************************
**  Description: ADD-BUG client-side JavaScript file
**************************************************************/

/* INSERT BUG CLIENT SIDE -------------------------------------------------- */

// Function to submit the bug's form data
let recordForm = document.getElementById('recordForm');
let spinner = document.getElementById('spinner');
spinner.style.visibility = "hidden";

recordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    spinner.style.visibility = "visible"; 
    let req = new XMLHttpRequest();
    let path = '/bug_tracker/all_bugs/insertBug';

    // Iterate over the checked programmers to create http query sub-string
    let programmerArr = [];
    for (let i = 0; i < recordForm.elements.length; i++) {
        try {
            if (recordForm.elements.programmerId[i].checked) {
                programmerArr.push(recordForm.elements.programmerId[i].value);
            }
        } catch(e) {
            continue;
        }
    }

    // Gather the selected programmer's names for rendering to the new cell
    let programmerList = [];
    let programmerCount = 0;
    for (let i = 0; i < recordForm.elements.length; i++) {
        try {
            if (recordForm.elements.programmerId[i].checked) {
                programmerCount++;
                programmerList.push(recordForm.elements.programmerId[i].nextElementSibling.innerHTML);
            }
        } catch(e) {
            continue;
        }
    }

    // Fill the project, if it has a value
    let project;
    if (recordForm.elements.bugProject.value == 'null') {
            recordForm.elements.bugProject.value = '';
        }
    if (recordForm.elements.bugProject.value) {
        project = recordForm.elements.bugProject.value;
    }

    // String that holds the form data
    let reqBody = {
        bugSummary: recordForm.elements.bugSummary.value,
        bugDescription: recordForm.elements.bugDescription.value,
        bugProject: project,
        programmerArr: programmerArr,
        bugStartDate: recordForm.elements.bugStartDate.value,
        bugPriority: recordForm.elements.bugPriority.value,
        bugFixed: recordForm.elements.bugFixed.value,
        bugResolution: recordForm.elements.bugResolution.value
    };

    reqBody = JSON.stringify(reqBody);

    // Ajax request
    req.open('POST', path, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', () => {
        if (req.status >= 200 && req.status < 400) {
            let response = JSON.parse(req.responseText);

            // Table of database records for the added companies
            let tbl = document.getElementById('recordTable');
            let newRow = tbl.insertRow(-1);

            // Bug Summary element
            let summaryCell = document.createElement('td');
            summaryCell.className = 'mdl-data-table__cell--non-numeric'; 
            let innerCell = document.createElement('div');
            summaryCell.appendChild(innerCell);
            innerCell.className = 'user-text';
            innerCell.textContent = recordForm.elements.bugSummary.value;
            newRow.appendChild(summaryCell);

            // Bug Description element
            let descriptionCell = document.createElement('td');
            descriptionCell.className = 'mdl-data-table__cell--non-numeric'; 
            innerCell = document.createElement('div');
            descriptionCell.appendChild(innerCell);
            innerCell.className = 'user-text';
            innerCell.textContent = recordForm.elements.bugDescription.value;
            newRow.appendChild(descriptionCell);

            // Project element
            let projectCell = document.createElement('td');
            let dropdown = document.getElementById("bug-project-field");
            projectCell.className = 'mdl-data-table__cell--non-numeric'; 
            if (recordForm.elements.bugProject.value == '') {
                projectCell.textContent = "NULL";
            } else {
                projectCell.textContent = dropdown.options[dropdown.selectedIndex].text;
            }
            newRow.appendChild(projectCell);

            // Programmers element
            let programmerCell = document.createElement('td');
            programmerCell.className = 'mdl-data-table__cell--non-numeric';
            newRow.appendChild(programmerCell);
            let progList = document.createElement('ul');
            let progElem = document.createElement('li')
            programmerCell.appendChild(progList);
            progList.appendChild(progElem);

            for (let i = 0; i < programmerCount; i++) {
                progElem.textContent = programmerList[i];
                progElem = document.createElement('li');
                progList.appendChild(progElem);
            }
            
            // Date started element
            let dateCell = document.createElement('td');
            dateCell.textContent = recordForm.elements.bugStartDate.value;
            newRow.appendChild(dateCell);

            // Priority element
            let priorityCell = document.createElement('td');
            priorityCell.textContent = recordForm.elements.bugPriority.value;
            newRow.appendChild(priorityCell);

            // Fixed element
            let fixedCell = document.createElement('td');
            fixedCell.className = 'bugFixed';
            if (recordForm.elements.bugFixed.value == 0) {
                fixedCell.textContent = " No ";
            } else {
                fixedCell.textContent = " Yes ";
            }
            newRow.appendChild(fixedCell);

            // Resolution element
            let resolutionCell = document.createElement('td');
            resolutionCell.className = 'mdl-data-table__cell--non-numeric'
            innerCell = document.createElement('div');
            resolutionCell.appendChild(innerCell);
            innerCell.textContent = recordForm.elements.bugResolution.value;
            innerCell.className = 'user-text';
            newRow.appendChild(resolutionCell);

            // Update button element
            let updateCell = document.createElement('td');
            newRow.appendChild(updateCell);
            let updateBtn = document.createElement('a');
            updateCell.appendChild(updateBtn);
            updateBtn.text = "Update"
            updateBtn.className = "update-btn";
            updateBtn.href = `/bug_tracker/edit_bug?bugId=${response.id}`;
            

            // Delete button element
            let deleteCell = document.createElement('td');
            newRow.appendChild(deleteCell);
            let deleteBtn = document.createElement('a');
            deleteCell.appendChild(deleteBtn);
            deleteBtn.type = "button";
            deleteBtn.text = "Delete";
            deleteBtn.className = "update-btn";
            deleteBtn.setAttribute('onclick', `deleteBug('recordTable', this, ${response.id})`);
            
            // Clear the submit form and reset the spinner
            updateChartAdd();
            document.getElementById('recordForm').reset();
            setTimeout(() => { spinner.style.visibility = "hidden"; }, 1000);

        } else {
            console.error('Database return error');
        }
    });

    req.send(reqBody);
});