-- -------------------------------
-- CS-340 Summer 2020: Group 34
-- -------------------------------

-- The colon operator : will be used to indicate variables containing backend data


-- Companies Page -------------------------------------------------------------

-- View all existing Companies --
SELECT * FROM Companies;

--Add new company --
INSERT INTO Companies (companyName, dateJoined) 
    VALUES (:req.body.companyName, :req.body.dateJoined);


-- Projects Page --------------------------------------------------------------

-- View all existing Projects --
SELECT * FROM Projects AS p
	JOIN Companies AS c ON p.companyId = c.companyId;

-- View all existing company names --
SELECT companyId, companyName FROM Companies;

-- Add new project --
INSERT INTO Projects (projectName, companyId, dateStarted, lastUpdated, inMaintenance)
    VALUES (:req.body.projectName, (SELECT companyId FROM Companies WHERE companyName = :req.body.companyName),
            :req.body.dateStarted, :req.body.lastUpdated, :req.body.inMaintenance);


-- Programmers Page -----------------------------------------------------------

-- View all existing Programmers --
SELECT * FROM Programmers;

-- Add new programmer --
INSERT INTO Programmers (firstName, lastName, email, dateStarted, accessLevel) 
    VALUES (:req.body.firstName, :req.body.lastName, :req.body.email, :req.body.dateStarted, :req.body.accessLevel);


-- Bugs Page ------------------------------------------------------------------

-- Display the project names in the dropdown --
SELECT projectName, projectId FROM Projects;

-- Display the Programmers in the scrolling checkbox list --
SELECT programmerId, firstName, lastName FROM Programmers;

-- View all existing Bugs with their programmers --
SELECT p.firstName, p.lastName, b.bugId, pj.projectName, b.bugSummary,
b.bugDescription, b.dateStarted, b.resolution, b.priority, b.fixed 
	FROM Programmers p 
		JOIN Bugs_Programmers bp ON p.programmerId = bp.programmerId
		JOIN Bugs b ON bp.bugId = b.bugId
		LEFT OUTER JOIN Projects pj ON b.projectId <=> pj.projectId
            ORDER BY bugId;

-- Add new bug --
INSERT INTO Bugs (bugSummary, bugDescription, projectId, dateStarted, priority, fixed, resolution) 
    VALUES (:req.body.bugSummary, :req.body.bugDescription,:req.body.bugProject,
             :req.body.bugStartDate, :req.body.bugPriority, :req.body.bugFixed, :req.body.bugResolution);

-- Run in a loop to insert a Bugs_Programmers row for each programmer --
INSERT INTO Bugs_Programmers (bugId, programmerId) VALUES (:result.insertId, :req.body.programmer[i]);

-- Delete bug --
DELETE FROM Bugs WHERE bugId = :req.body.bugId;

-- Search bugs --
SELECT bugId FROM Bugs WHERE CONCAT(bugSummary, bugDescription, resolution) LIKE %:req.body.searchString%;

-- Get data from all bugs that match search --
SELECT p.firstName, p.lastName, b.bugId, pj.projectName, b.bugSummary, b.bugDescription,  
b.dateStarted, b.resolution, b.priority, b.fixed 
	FROM Programmers p 
        JOIN Bugs_Programmers bp ON p.programmerId = bp.programmerId 
        JOIN Bugs b ON bp.bugId = b.bugId  
        LEFT OUTER JOIN Projects pj ON b.projectId = pj.projectId 
            WHERE b.bugId IN (:bugIdList) 
            ORDER BY b.bugId;


-- Update bug -----------------------------------------------------------------

-- Display the project names in the dropdown --
SELECT projectName FROM projects;

-- Display the Programmers in the scrolling checkbox list --
SELECT programmerId, firstName, lastName FROM PROGRAMMERS;

-- View all existing Bugs with their programmers --
SELECT p.firstName, p.lastName, b.bugId, pj.projectName, b.bugSummary,
b.bugDescription, b.dateStarted, b.resolution, b.priority, b.fixed 
	FROM Programmers p 
		JOIN Bugs_Programmers bp ON p.programmerId = bp.programmerId
		JOIN Bugs b ON bp.bugId = b.bugId
		LEFT OUTER JOIN Projects pj ON b.projectId = pj.projectId
			ORDER BY bugId;


-- Update M:M relationship Bugs_Programmers --
UPDATE Bugs SET bugSummary = :bugSummaryInput, bugDescription = :bugDescriptionInput, dateStarted = :dateStartedInput,
priority = :priorityInput, resolution = :resolutionInput, fixed = :fixedInput 
    WHERE bugId = :bugIdInput;

 -- Delete the previous Bugs_Programmers rows --
DELETE FROM Bugs_Programmers WHERE bugId = :req.body.bugId;

-- Run in a loop to insert a Bugs_Programmers row for each programmer --
INSERT INTO Bugs_Programmers (bugId, programmerId) VALUES (:req.body.bugId, :req.body.programmer[i]);
