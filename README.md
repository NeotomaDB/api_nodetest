# Neotoma API Implementation

This repository is intended to act as the core repository for the Neotoma API version 2 and greater.  There are two main branches, `master` and `dev`.  Master is intended as the production branch, while `dev` is the main testing and development branch.  For documentation of the Neotoma Paleoecology Database see [this](http://neotoma-manual.readthedocs.io/en/latest/neotoma_introduction.html) and of the community see [this](https://www.neotomadb.org/).  Version 1 of the API is documented [here](http://api.neotomadb.org/doc/home).

Currently [http://api-dev.neotomadb.org]() is the home for the API, and will resolve to a [Swagger](http://swagger.io) landing page with API documentation and search functionality.  The documentation is generated dynamically using [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc), as implemented in the `routes` files.  For an example, see [`routes/data.js`](https://github.com/NeotomaDB/api_nodetest/blob/dev/routes/data.js).

## Development

* Simon Goring - website: [http://goring.org]()
* Mike Stryker

## Contribution

We welcome user contributions to this project.  All contributors are expected to follow the [code of conduct](https://github.com/Neotomadb/api_nodetest/blob/master/code_of_conduct.md).  Contributors should fork this project and make a pull request indicating the nature of the changes and the intended utility.  Further information for this workflow can be found on the GitHub [Pull Request Tutorial webpage](https://help.github.com/articles/about-pull-requests/).

## Description

This codebase is generated using `node.js`, `express` and `pg-promise` to interact with the Neotoma `postgres` database. The API endpoints are organized conceptually by applications (apps), data, and direct access to specific tables (dbtables). This project is based on and replaces an existing API implemented with .NET and SQLServer.

This code is currently in preliminary release.

### Required Files

Along with the files in this repository a user will need a file called `db_connect.json`, to be located in the database directory.

```json
{
   "host": "localhost",
   "port": 5432,
   "database": "YOUR_DATABASE_NAME",
   "user": "postgres",
   "password": "postgres"
}
```

For security reasons this file is not included in the GitHub repository, but can be made available.

### To Run

To start the server locally you must first clone the repository.  Once the repository is cloned you must use the `npm` package installer to download the required packages.  The required packages are listed in `package.json`.  You can use the command `npm install` to install the packages locally.

Once the directory is set up and the packages have been installed, use `npm start` to start the server locally.  This will create a local server, serving data to `localhost:3000`.

```
$ npm start

> api-nodetest@0.0.0 start /home/simon/Documents/GitHub/api_nodetest
> node ./bin/www


```

#### Testing

The API uses `mocha` as a test package.  Tests are located in the [test folder](https://github.com/NeotomaDB/api_nodetest/tree/master/test) and can be run using `mocha test` from the command line once the server is running:

```
$ mocha test

 Get taxon data:
    ✓ An empty query redirects to the api documentation.
    ✓ A single taxon should be returned by id: (80ms)
    ✓ Taxon queries should be case insensitive: (120ms)
```

### To Edit

Feel free to make changes to the code.  In particular, if there are new endpoints required, or changes in the way data are returned or documentation is provided, please let us know, or contribute directly.  The code for running the queries is in `./queries.js`, the routing is in `./routes/index.js`.

## Funding

This work is funded by NSF grants to Neotoma: NSF Geoinformatics - [1550707](https://www.nsf.gov/awardsearch/showAward?AWD_ID=1550707&HistoricalAwards=false) and NSF EarthCube [1541002](https://www.nsf.gov/awardsearch/showAward?AWD_ID=1541002&HistoricalAwards=false).