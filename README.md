[![Build Status](https://travis-ci.com/CMU-17-356/dronuts2020-team-d.svg?token=GCxhxHvgRUSPSAmJy4Ff&branch=master)](https://travis-ci.com/CMU-17-356/dronuts2020-team-d)

# Team D dronut-starter
Team D's sprint 0 focused on preparing to write productive code.

### Online Deployment
The application is running live at: http://104.42.174.187/

### Local Startup and Deployment
To start up the application locally, first run `npm install` then `npm start` within the client and server directories. Afterwards the application should be running locally at http://localhost:3000/

### Local Testing
To run tests locally first run `npm install` then `npm test` within the server directory.

### QA Tools List
* Continuous Integration: [Travis-CI](https://travis-ci.com/CMU-17-356/dronuts2020-team-d)
* Web Framework: [Express](https://expressjs.com/)
* Linter: [eslint](https://eslint.org/docs/user-guide/getting-started)
* Dependency Updater: [npm-check](https://www.npmjs.com/package/npm-check)
* Test Framework: [Jest](https://jestjs.io/)

### Progress as of 3/26/20 (Homework 05)
The web application is now at its MVP status:
* Customer and employee facing sides are fully communicating and reflect one another.
* Puppeteer end-to-end tests have been implemented and work off of the live application deployment
* Numerous bug fixes and site adjustments that are documented on our Trello board which again can be found in our wiki

### Progress as of 2/27/20 (Homework 04)
The web application now has our minimal feature set implemented which allows:
* Customer to make orders and fill out their information to submit it
* Employees to login to gain access to exclusive privileges (found in the footer, password is "password")
* Employees to create new donut items and edit old ones
* Employees to see submitted orders and fulfill them using the drones
There are more than a few bugs and changes that need to be made, which are heavily noted on our Trello board.

### Progress as of 2/12/20 (Homework 03)
In addition to key models and their tests, there are currently six front-end pages that have been developed for this project with highly limited functionality. Some of them can be navigated to using the existing navbar, but others are must be selected from their appropriate parent page. Those include the Order Show Page which can be found by clicking the first order on the Order Index Page, and the Edit Menu Item Page that can be found by clicking any item's name on the menu page. There is also no homepage at this time. Links to all existing pages can also be found below:
* Menu Page: http://104.42.174.187/menu
* Edit Menu Item Page: http://104.42.174.187/editMenuItemPage
* Order Index Page: http://104.42.174.187/orders
* Order Show Page: http://104.42.174.187/pairingPage
* Cart/Checkout Page: http://104.42.174.187/cart
* Signup/Login Page: http://104.42.174.187/signupLogin
