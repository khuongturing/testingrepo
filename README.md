# Ecommerce-API-Backend

This API is built based on NodeJs With ExpressJs Framework using MVC and [Swagger UI](http://asiantvcdn.duckdns.org:3000/api-docs/v1)/[ReDoc UI](http://asiantvcdn.duckdns.org:3000/api-docs/v2) for the API Docs. It tooks me about 26hours to finish this Turing Backend API Challenge.

This API consists of 9 Endpoint Groups and 46 endpoints.<br> Check Out the API Docs for Details and List of APIs plus any possible Error Messages which is listed there and Try it Out. <br><pre> API Docs: http://asiantvcdn.duckdns.org:3000/api-docs/v1</pre>

Below is the folder Structure of the project.<br>
<img src="https://github.com/Vichet97/Ecommerce-API-Backend/blob/master/images/Structure.PNG?raw=true"> <br>
- index: The main app of the API server with some mudules config which is used by the API<br>
- db: connections pool for MySql Queries<br>
- cert folder: The Key and Cert for HTTPS Scheme which is also available on port 443<br>
- controllers folder: API Routes Controller for each endpoints and also appController which contains common functions for using with the APP<br>
<img src="https://github.com/Vichet97/Ecommerce-API-Backend/blob/master/images/Controllers.PNG?raw=true"> <br>
- models folder: Common Functions and Configs of MySQL Quries for Controllers<br>
- routes folder: All Routes and Endpoints of API<br>

## Getting Started

### Requirements
* [NodeJs](https://nodejs.org/en/download/)
* [MySQL](https://www.mysql.com/downloads/)
### Dependencies
* [Express](https://www.npmjs.com/package/express)
* [Nodemon](https://www.npmjs.com/package/nodemon)
* [Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express)<br>
................

### Installation
* Clone this repository `git clone https://github.com/Vichet97/Ecommerce-API-Backend.git`
* Go to project root folder `cd Ecommerce-API-Backend`
* Create Database on MySQL and migrate the database given `tshirtshop.sql`
```sh
mysql -u <dbuser> -D <databasename> -p < tshirtshop.sql
```
* Run `npm install` or `yarn` to install the project dependencies
* Run `nodemon` command to start the project which helps node.js based applications by automatically restarting the node application when file changes in the directory are detected

