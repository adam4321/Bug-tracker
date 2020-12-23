# Software Bug Tracker

Application for adding cataloging software bugs and assigning them
to one or more programmers to be fixed. It displays the percentage of
open bugs for each programmer and for the overall bug list, to allow
the users to understand the backlog.

The application uses Handlebars to server-side render each
of its pages and then vanilla JavaScript on the client-side
to update pages. The server-side uses Node.js and Express
and the database is MySql which is deployed locally.