# STOCK MARKET SERVER
Server side manager for [stock_market](https://www.github.com/papiricoh/stock_market) built in express.js and node.js

## INSTALATION
After cloning the repository execute
````
npm install
````
To install all components of the manager.

Install the .sql file into your database.

Create a file called `db.config.js` under `app/config` and paste and fill this:
````
module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "root",
    DB: "stock_market"
};
````

Start node: 
```
node server.js
```