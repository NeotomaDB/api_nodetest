[![lifecycle](https://img.shields.io/badge/lifecycle-experimental-orange.svg)](https://www.tidyverse.org/lifecycle/#experimental)

[![NSF-1550707](https://img.shields.io/badge/NSF-1550707-blue.svg)](https://nsf.gov/awardsearch/showAward?AWD_ID=1550707) [![NSF-1541002](https://img.shields.io/badge/NSF-1541002-blue.svg)](https://nsf.gov/awardsearch/showAward?AWD_ID=1541002)


# Neotoma API Implementation

This repository is intended to act as the core repository for the Neotoma API version 1.5 and greater.  There are two main branches, `master` and `dev`.  Master is intended as the production branch, while `dev` is the main testing and development branch.  For documentation of the Neotoma Paleoecology Database see [this](http://neotoma-manual.readthedocs.io/en/latest/neotoma_introduction.html) and of the community see [this](https://www.neotomadb.org/).  Version 1 of the API is documented [here](http://wnapi.neotomadb.org/doc/home).

Currently [http://api.neotomadb.org]() is the home for the API, and will resolve to a [OpenAPI](http://swagger.io) landing page with API documentation and search functionality.  The documentation is generated dynamically using [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc), as implemented in the `routes` files.  For an example, see [`routes/data.js`](https://github.com/NeotomaDB/api_nodetest/blob/dev/routes/data.js).

## Development

* [Simon Goring](http://goring.org): University of Wisconsin - Madison [![orcid](https://img.shields.io/badge/orcid-0000--0002--2700--4605-brightgreen.svg)](https://orcid.org/0000-0002-2700-4605)
* Mike Stryker: Pennsylvania State University

## Contribution

We welcome user contributions to this project.  All contributors are expected to follow the [code of conduct](https://github.com/Neotomadb/api_nodetest/blob/master/code_of_conduct.md).  Contributors should fork this project and make a pull request indicating the nature of the changes and the intended utility.  Further information for this workflow can be found on the GitHub [Pull Request Tutorial webpage](https://help.github.com/articles/about-pull-requests/).

## Description

This codebase is generated using `node.js`, `express` and `pg-promise` to interact with the Neotoma `postgres` database. The API endpoints are organized conceptually by applications (apps), data, and direct access to specific tables (dbtables). This project is based on and replaces an existing API implemented with .NET and SQLServer.

This code is currently in preliminary release.

### Required Files/Services

#### Database Snapshot

The code in this repository is run directly against the production database on the Neotoma servers at the Center for Environmental Informatics at Penn State.  It is possible to run this repository on a local server (on your own machine) or on a remote server (using cloud services or a university server) by installing Postgres and restoring one of the [Neotoma Database Snapshots](https://www.neotomadb.org/snapshots).  If you are planning to run the application in this way, please ensure that you have set appropriate security measures, and have these documented in the `db_connect.json` file, as described below.

#### Connection File

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

### Adding or Editing an API Endpoint

The current API reflects the needs of certain users who have directly communicated their needs to the development team.  Future users, or groups may wish to support services from Neotoma that are currently not implemented.  Adding a new service to the API should be done in a new fork of the repository, and includes the following steps:

#### Create a `helpers` folder

Your new service, for example `example`, will have its own folder in the `[helpers](https://github.com/NeotomaDB/api_nodetest/tree/master/v2.0/helpers)` folder.  This is to ensure that all the resources are kept well organized in one place.  In general that folder will contain a `js` file (`example.js`) and a SQL file, that will directly query the database (`example.sql`).

If the query is very simple (a simple `SELECT * FROM xxx.xxxxx` query), it is possible to use only a `js` file, as in `[helpers/frozen/frozen.js](https://github.com/NeotomaDB/api_nodetest/blob/master/v2.0/helpers/frozendata/frozen.js#L9)`.

The existing files and folders in the `helpers` directory can easily be used as a template for new API endpoints.  Feel free to make changes to the code.  In particular, if there are new endpoints required, or changes in the way data are returned or documentation is provided, please let us know, or contribute directly.

Once the desired SQL query is written and the `js` file to access it from nod/express is implemented we then need to edit the file that handles requests to the `data` route.  We can find this file in `[v2.0/handlers/data_handlers.js](https://github.com/NeotomaDB/api_nodetest/blob/master/v2.0/handlers/data_handlers.js)`.  You are defining a function name here, that will be called by the router.

The router is in `[routes/data.js](https://github.com/NeotomaDB/api_nodetest/blob/master/v2.0/routes/data.js)`. It lets us know what function and parameters are associated with each URL route.  For example, someone calling our API using: `http://api-dev.neotomadb.org/v2.0/data/sites/132/contacts` would be directed to the function defined in the `handler.js` file called `contactsbysiteid`, since our routing file includes the call: `[router.get('/sites/:siteid/contacts', handlers.contactsbysiteid);](https://github.com/NeotomaDB/api_nodetest/blob/master/v2.0/routes/data.js#L20)`.  We also know that within the `contactsbysiteid()` function (in `helpers/contacts`) there would be a parameter called `siteid`

## Funding

This work is funded by NSF grants to Neotoma: NSF Geoinformatics - [1550707](https://www.nsf.gov/awardsearch/showAward?AWD_ID=1550707&HistoricalAwards=false)/[1948926](https://www.nsf.gov/awardsearch/showAward?AWD_ID=1948926&HistoricalAwards=false) and NSF EarthCube [1541002](https://www.nsf.gov/awardsearch/showAward?AWD_ID=1541002&HistoricalAwards=false).
