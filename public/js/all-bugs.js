/*************************************************************
**  Description: USER-HOME client-side JavaScript file
**************************************************************/

// Function to force a page reload when using the back button
window.onunload = function() {};

if (window.history.state != null && window.history.state.hasOwnProperty('historic')) {
    if (window.history.state.historic == true) {
        document.body.style.display = 'none';
        window.history.replaceState({historic: false}, '');
        window.location.reload();
    } else {
        window.history.replaceState({historic  : true}, '');
    }
} else {
    window.history.replaceState({historic  : true}, '');
}


/* INSERT BUG VERIFY PROGRAMMER CHECKED -------------------------------------*/

// // Function to verify that at least 1 programmer is checked
// function checkBoxChecked() {
//     const form = document.querySelector('#recordForm');
//     const checkboxes = form.querySelectorAll('input[type=checkbox]');
//     const checkboxLength = checkboxes.length;
//     const firstCheckbox = checkboxLength > 0 ? checkboxes[0] : null;

//     function init() {
//         if (firstCheckbox) {
//             for (let i = 0; i < checkboxLength; i++) {
//                 checkboxes[i].addEventListener('change', checkValidity);
//             }

//             checkValidity();
//         }
//     }

//     function isChecked() {
//         for (let i = 0; i < checkboxLength; i++) {
//             if (checkboxes[i].checked) return true;
//         }

//         return false;
//     }

//     function checkValidity() {
//         const errorMessage = !isChecked() ? 'At least one checkbox must be selected.' : '';
//         firstCheckbox.setCustomValidity(errorMessage);
//     }

//     init();
// };


// /* INSERT BUG CLIENT SIDE -------------------------------------------------- */

// // Function to submit the bug's form data
// let recordForm = document.getElementById('recordForm');
// let spinner = document.getElementById('spinner');
// spinner.style.visibility = "hidden";

// recordForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     spinner.style.visibility = "visible"; 
//     let req = new XMLHttpRequest();
//     let path = '/bug_tracker/all_bugs/insertBug';

//     // Iterate over the checked programmers to create http query sub-string
//     let programmerArr = [];
//     for (let i = 0; i < recordForm.elements.length; i++) {
//         try {
//             if (recordForm.elements.programmerId[i].checked) {
//                 programmerArr.push(recordForm.elements.programmerId[i].value);
//             }
//         } catch(e) {
//             continue;
//         }
//     }

//     // Gather the selected programmer's names for rendering to the new cell
//     let programmerList = [];
//     let programmerCount = 0;
//     for (let i = 0; i < recordForm.elements.length; i++) {
//         try {
//             if (recordForm.elements.programmerId[i].checked) {
//                 programmerCount++;
//                 programmerList.push(recordForm.elements.programmerId[i].nextElementSibling.innerHTML);
//             }
//         } catch(e) {
//             continue;
//         }
//     }

//     // Fill the project, if it has a value
//     let project;
//     if (recordForm.elements.bugProject.value == 'null') {
//             recordForm.elements.bugProject.value = '';
//         }
//     if (recordForm.elements.bugProject.value) {
//         project = recordForm.elements.bugProject.value;
//     }

//     // String that holds the form data
//     let reqBody = {
//         bugSummary: recordForm.elements.bugSummary.value,
//         bugDescription: recordForm.elements.bugDescription.value,
//         bugProject: project,
//         programmerArr: programmerArr,
//         bugStartDate: recordForm.elements.bugStartDate.value,
//         bugPriority: recordForm.elements.bugPriority.value,
//         bugFixed: recordForm.elements.bugFixed.value,
//         bugResolution: recordForm.elements.bugResolution.value
//     };

//     reqBody = JSON.stringify(reqBody);

//     // Ajax request
//     req.open('POST', path, true);
//     req.setRequestHeader('Content-Type', 'application/json');
//     req.addEventListener('load', () => {
//         if (req.status >= 200 && req.status < 400) {
//             let response = JSON.parse(req.responseText);

//             // Table of database records for the added companies
//             let tbl = document.getElementById('recordTable');
//             let newRow = tbl.insertRow(-1);

//             // Bug Summary element
//             let summaryCell = document.createElement('td');
//             summaryCell.className = 'mdl-data-table__cell--non-numeric'; 
//             let innerCell = document.createElement('div');
//             summaryCell.appendChild(innerCell);
//             innerCell.className = 'user-text';
//             innerCell.textContent = recordForm.elements.bugSummary.value;
//             newRow.appendChild(summaryCell);

//             // Bug Description element
//             let descriptionCell = document.createElement('td');
//             descriptionCell.className = 'mdl-data-table__cell--non-numeric'; 
//             innerCell = document.createElement('div');
//             descriptionCell.appendChild(innerCell);
//             innerCell.className = 'user-text';
//             innerCell.textContent = recordForm.elements.bugDescription.value;
//             newRow.appendChild(descriptionCell);

//             // Project element
//             let projectCell = document.createElement('td');
//             let dropdown = document.getElementById("bug-project-field");
//             projectCell.className = 'mdl-data-table__cell--non-numeric'; 
//             if (recordForm.elements.bugProject.value == '') {
//                 projectCell.textContent = "NULL";
//             } else {
//                 projectCell.textContent = dropdown.options[dropdown.selectedIndex].text;
//             }
//             newRow.appendChild(projectCell);

//             // Programmers element
//             let programmerCell = document.createElement('td');
//             programmerCell.className = 'mdl-data-table__cell--non-numeric';
//             newRow.appendChild(programmerCell);
//             let progList = document.createElement('ul');
//             let progElem = document.createElement('li')
//             programmerCell.appendChild(progList);
//             progList.appendChild(progElem);

//             for (let i = 0; i < programmerCount; i++) {
//                 progElem.textContent = programmerList[i];
//                 progElem = document.createElement('li');
//                 progList.appendChild(progElem);
//             }
            
//             // Date started element
//             let dateCell = document.createElement('td');
//             dateCell.textContent = recordForm.elements.bugStartDate.value;
//             newRow.appendChild(dateCell);

//             // Priority element
//             let priorityCell = document.createElement('td');
//             priorityCell.textContent = recordForm.elements.bugPriority.value;
//             newRow.appendChild(priorityCell);

//             // Fixed element
//             let fixedCell = document.createElement('td');
//             fixedCell.className = 'bugFixed';
//             if (recordForm.elements.bugFixed.value == 0) {
//                 fixedCell.textContent = " No ";
//             } else {
//                 fixedCell.textContent = " Yes ";
//             }
//             newRow.appendChild(fixedCell);

//             // Resolution element
//             let resolutionCell = document.createElement('td');
//             resolutionCell.className = 'mdl-data-table__cell--non-numeric'
//             innerCell = document.createElement('div');
//             resolutionCell.appendChild(innerCell);
//             innerCell.textContent = recordForm.elements.bugResolution.value;
//             innerCell.className = 'user-text';
//             newRow.appendChild(resolutionCell);

//             // Update button element
//             let updateCell = document.createElement('td');
//             newRow.appendChild(updateCell);
//             let updateBtn = document.createElement('a');
//             updateCell.appendChild(updateBtn);
//             updateBtn.text = "Update"
//             updateBtn.className = "update-btn";
//             updateBtn.href = `/bug_tracker/edit_bug?bugId=${response.id}`;
            

//             // Delete button element
//             let deleteCell = document.createElement('td');
//             newRow.appendChild(deleteCell);
//             let deleteBtn = document.createElement('a');
//             deleteCell.appendChild(deleteBtn);
//             deleteBtn.type = "button";
//             deleteBtn.text = "Delete";
//             deleteBtn.className = "update-btn";
//             deleteBtn.setAttribute('onclick', `deleteBug('recordTable', this, ${response.id})`);
            
//             // Clear the submit form and reset the spinner
//             updateChartAdd();
//             document.getElementById('recordForm').reset();
//             setTimeout(() => { spinner.style.visibility = "hidden"; }, 1000);

//         } else {
//             console.error('Database return error');
//         }
//     });

//     req.send(reqBody);
// });


/* DELETE BUG CLIENT SIDE -------------------------------------------------- */

// Function call to delete a row from bug
function deleteBug(tbl, curRow, bugId) {
    let table = document.getElementById(tbl);
    let rowCount = table.rows.length;
    let req = new XMLHttpRequest();
    let path = "/bug_tracker/all_bugs/deleteBug";

    reqBody = JSON.stringify({bugId: bugId});

    req.open("POST", path, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", () => {
        if (req.status >= 200 && req.status < 400) {
            for (let i = 0; i < rowCount; i++) {
                let row = table.rows[i];
        
                if (row == curRow.parentNode.parentNode) {
                    table.deleteRow(i);
                }
            }
            updateChartDelete();
        } 
        else {
            console.error("Delete request error");
        }
    });

    req.send(reqBody);
} 


/* VIEW ALL BUGS CLIENT SIDE ----------------------------------------------- */

// Function call to clear search results
let viewAllButton = document.getElementById("clear-search");
viewAllButton.setAttribute('onclick', 'viewAllBugs()');

function viewAllBugs() {
    path = "/bug_tracker/all_bugs/viewAllBugs";
    let req = new XMLHttpRequest();

    req.open("POST", path, true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.send();

    req.addEventListener("load", () => {
        if (req.status >= 200 && req.status < 400) {
            let bugsArray = JSON.parse(req.responseText).bugs;

            // clear table before building search results
            let tableBody = document.getElementById("table-body");
            tableBody.innerHTML = '';

            // if no existing bugs
            if(bugsArray.length == 0) {
                let newRow = tableBody.insertRow(-1);
                let summaryCell = document.createElement('td');
                summaryCell.textContent = "No current bugs!";
                summaryCell.style.color = "#ff0000";
                summaryCell.className = 'mdl-data-table__cell--non-numeric'; 
                newRow.appendChild(summaryCell);
                return;
            }

            // build rows for each bug if there is at least one result
            bugsArray.forEach(element => {
                createRow(tableBody, element);
            });

        } else {
            console.error("View all bugs: request error.");
        }
    });
}


/* SEARCH BUG CLIENT SIDE -------------------------------------------------- */

// Function call to search bug table for substring
let searchButton = document.getElementById("search-btn");
searchButton.addEventListener('click', searchBug);

function searchBug() {
    let searchString = document.getElementById("search-input").value;
    let path = "/bug_tracker/all_bugs/searchBug";
    let req = new XMLHttpRequest();
    let reqBody = JSON.stringify({searchString: searchString});

    req.open("POST", path, true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.send(reqBody); 

    req.addEventListener("load", () => {
        if (req.status >= 200 && req.status < 400) {
            let bugsArray = JSON.parse(req.responseText).bugs;

            // clear table before building search results
            let tableBody = document.getElementById("table-body");
            tableBody.innerHTML = '';

            // if no results are found
            if(bugsArray.length == 0) {
                let newRow = tableBody.insertRow(-1);
                let summaryCell = document.createElement('td');
                summaryCell.textContent = "No results found!";
                summaryCell.style.color = "#ff0000";
                summaryCell.className = 'mdl-data-table__cell--non-numeric'; 
                newRow.appendChild(summaryCell);
                return;
            }

            // build rows for each bug if there is at least one result
            bugsArray.forEach(element => {
                createRow(tableBody, element);
            });

            // Clear the searchbar
            document.getElementById('search-form').reset()

        } else {
            console.error("Search request error.");
        }
    });
};


// Function to create new bug row after searching
function createRow(tableBody, bugData) {
    let newRow = tableBody.insertRow(-1);

    // Bug Summary element
    let summaryCell = document.createElement('td');
    summaryCell.className = 'mdl-data-table__cell--non-numeric';
    let innerCell = document.createElement('div');
    summaryCell.appendChild(innerCell);
    innerCell.textContent = bugData.bugSummary;
    innerCell.className = 'user-text';
    newRow.appendChild(summaryCell);

    // Bug Description element
    let descriptionCell = document.createElement('td');
    descriptionCell.className = 'mdl-data-table__cell--non-numeric';
    innerCell = document.createElement('div');
    descriptionCell.appendChild(innerCell);
    innerCell.textContent = bugData.bugDescription;
    innerCell.className = 'user-text';
    newRow.appendChild(descriptionCell);

    // Project element
    let projectCell = document.createElement('td');
    projectCell.className = 'mdl-data-table__cell--non-numeric'; 
    projectCell.textContent = bugData.projectName;
    if(projectCell.textContent == "") {
        projectCell.textContent = "NULL";
    }
    newRow.appendChild(projectCell);

    // Programmers element
    let programmerCell = document.createElement('td');
    programmerCell.className = 'mdl-data-table__cell--non-numeric';
    let cellString = '';
    for (i = 0; i < bugData.programmers.length; i++) {
        cellString += bugData.programmers[i] + '<br>';
    }
    programmerCell.innerHTML = cellString;
    newRow.appendChild(programmerCell);

    // Date started element
    let dateCell = document.createElement('td');
    dateCell.textContent = bugData.dateStarted;
    newRow.appendChild(dateCell);

    // Priority element
    let priorityCell = document.createElement('td');
    priorityCell.textContent = bugData.priority;
    newRow.appendChild(priorityCell);

    // Fixed element
    let fixedCell = document.createElement('td');
    fixedCell.className = 'bugFixed';
    if (bugData.fixed == 0) {
        fixedCell.textContent = " No "
    } else {
        fixedCell.textContent = " Yes ";
    }
    newRow.appendChild(fixedCell);

    // Resolution element
    let resolutionCell = document.createElement('td');
    resolutionCell.className = 'mdl-data-table__cell--non-numeric';
    innerCell = document.createElement('div');
    resolutionCell.appendChild(innerCell);
    innerCell.textContent = bugData.resolution;
    innerCell.className = 'user-text';
    newRow.appendChild(resolutionCell);

    // Update button element
    let updateCell = document.createElement('td');
    newRow.appendChild(updateCell);
    let updateBtn = document.createElement('a');
    updateCell.appendChild(updateBtn);
    updateBtn.text = "Update";
    updateBtn.className = "update-btn";
    updateBtn.href = `/bug_tracker/edit_bug?bugId=${bugData.bugId}`;

    // Delete button element
    let deleteCell = document.createElement('td');
    newRow.appendChild(deleteCell);
    let deleteBtn = document.createElement('a');
    deleteCell.appendChild(deleteBtn);
    deleteBtn.type = "button";
    deleteBtn.text = "Delete";
    deleteBtn.className = "update-btn";
    deleteBtn.setAttribute('onclick', `deleteBug('recordTable', this, ${bugData.bugId})`);
}

// Change behavior of pressing 'Enter' on search bar. 
let searchInput = document.getElementById("search-input");

searchInput.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById('search-btn').click();
    }
});


/* FIXED BUGS DOUGHNUT CHART ----------------------------------------------- */

// Function using D3.js to render a new doughnut chart with svg
function printChart(fixedCount, brokenCount, countSize) {
    // Set the dimensions and margins of the graph
    let width = 380
        height = 380
        margin = 30

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    let radius = Math.min(width, height) / 2 - margin

    // Append the svg object to the div called 'my_dataviz'
    let svg = d3.select("#my_dataviz")
        .append("svg")
            .attr("width", width)
            .attr("height", height)
        .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Enter bug data
    let data = {a: fixedCount, b: brokenCount}

    // Set up graph text percentage in center
    var centralText = svg.append("text")
        .attr("text-anchor", "middle")
        .attr('font-size', '65px')
        .attr('y', 20)
        .style("opacity", 0.45);

    // Create the central percentage
    centralText.text(d3.format(".0%")(fixedCount / countSize));

    // Set the graph color scale
    let color = d3.scaleOrdinal()
        .domain(data)
        .range(["#004020", "#a50020"])      // Set colors for chart

    // Compute the position of each group on the pie:
    let pie = d3.pie()
        .value(function(d) {return d.value; })
    let data_ready = pie(d3.entries(data))

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
        .selectAll('whatever')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(100)         // This is the size of the donut hole
            .outerRadius(radius)
        )
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.58)
}


// Function to walk the bugs table and gather a count of fixed and broken bugs
function countFixedVals() {
    let recordTable = document.getElementById('recordTable');
    let cells = document.getElementsByClassName('bugFixed')

    let count = recordTable.rows.length - 1;
    let fixedCount = 0;
    
    // Gather the number of fixed bugs
    for (let i = 0; i < cells.length; i++) {
        try {
            if (cells[i].firstChild.textContent == ' Yes ') {
                fixedCount++;
            }
        } catch(e) {
            console.error(e);
        }
    }

    // Calculate the number of broken bugs
    let brokenCount = count - fixedCount;

    let fixedObj = {fixed: fixedCount, broken: brokenCount, count: count};
    return fixedObj;
}


// Function to create the chart on initial page load
function initChart() {
    // Call the function to crawl the table
    let fixedObj = countFixedVals();

    printChart(fixedObj.fixed, fixedObj.broken, fixedObj.count);
}


// Function to update the chart on database reset
function updateChartReset() {
    let count = 20;
    let fixedCount = 2;
    let brokenCount = 18;

    // Clear the chart and then print it
    let chartDiv = document.getElementById('my_dataviz');
    chartDiv.innerHTML = '';
    printChart(fixedCount, brokenCount, count);
}


// Function to update the chart when deleting a bug
function updateChartDelete() {
    // Call the function to crawl the table
    let fixedObj = countFixedVals();

    // Clear the chart and then print it
    let chartDiv = document.getElementById('my_dataviz');
    chartDiv.innerHTML = '';
    printChart(fixedObj.fixed, fixedObj.broken, fixedObj.count);
}


// Function to update the chart when adding a bug
function updateChartAdd() {
    // Call the function to crawl the table
    let fixedObj = countFixedVals();

    // Clear the chart and then print it
    let chartDiv = document.getElementById('my_dataviz');
    chartDiv.innerHTML = '';
    printChart(fixedObj.fixed, fixedObj.broken, fixedObj.count);
}


// Initial call to create and print the chart
initChart();
