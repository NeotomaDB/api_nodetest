# Neotoma API Implementation

This repository is intended to act as the core repository for the Neotoma API.  There are two main branches.  `master` and `dev`.  Master is intended as the production branch, while `dev` is the main testing and development branch.

Currently [http://api-dev.neotomadb.org]() is the home for the API, and will resolve to a [Swagger](http://swagger.io) landing page with API documentation.  This is generated dynamically using [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc), as implemented in [`routes/index.js`](https://github.com/NeotomaDB/api_nodetest/blob/master/routes/index.js).

## Development

* Simon Goring - website: [http://goring.org]()
* Mike Stryker

## Contribution

We welcome open contribution to this project.  All contributors are expected to follow the [code of conduct](https://github.com/Neotomadb/api_nodetest/blob/master/code_of_conduct.md).  Contributors should fork this project and make a pull request indicating the nature of the changes and the intended utility.

## Description

This codebase is generated using `node.js` and `express`, to interact with the Neotoma `postgres` database.

This code is currently in preliminary release.

### Required Files

Along with the files in this repository a user will need a file called `db_connect.json`, to be located in the root directory.

```json
{
   "host": "localhost",
   "port": 5432,
   "database": "YOUR_DATABASE_NAME",
   "user": "postgres",
   "password": "postgres"
}
```

### To Run

To start the server locally you must first clone the repository.  Once the repository is cloned you must use the `npm` package installer to download the required packages.  The required packages are listed in `package.json`.  You can use the command `npm install` to install the packages locally.

Once the directory is set up and the packages have been installed, use `npm start` to start the server locally.  This will create a local server, serving data to `localhost:3000`.

### To Edit

Feel free to make changes to the code.  In particular, if there are new endpoints required, or changes in the way data are returned or documentation is provided, please let us know, or contribute directly.  The code for running the queries is in `./queries.js`, the routing is in `./routes/index.js`.

## Funding

This work is funded by NSF grants to Neotoma: NSF Geoinformatics - [1550707](https://www.nsf.gov/awardsearch/showAward?AWD_ID=1550707&HistoricalAwards=false) and NSF EarthCube [1541002](https://www.nsf.gov/awardsearch/showAward?AWD_ID=1541002&HistoricalAwards=false).
