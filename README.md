1. Run "npm install".
2. Run "npm run full-start" and wait for the console output "Server running at http://127.0.0.1:8124".
3. Open http://127.0.0.1:8124 in your browser.

Known issues:
1) Application has just base styles for it's markup. Also it has minimalistic design.
2) The filter fields aren't linked with each other (single filtering).
3) Rendering table with the 1k items within 1 execution doesn’t seem to be a good approach. This will be definitely "performance killer" (especially for old browsers). The more preferable approach is lazy loading/rendering.
4) Still I have low rendering issue for ie8 (the table with the user list).
5) I showed all the items inside the users table because there is no any requirements about fields that have to be shown.
6) Server side aren't used any additional frameworks for routing and templaters due to simple server logic.
