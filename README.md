[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/9788/badge)](https://www.bestpractices.dev/projects/9788)
![lifecycle](https://img.shields.io/badge/lifecycle-active-orange.svg) [![DOI](https://zenodo.org/badge/91914528.svg)](https://zenodo.org/badge/latestdoi/91914528)

[![NSF-1550707](https://img.shields.io/badge/NSF-1550707-blue.svg)](https://nsf.gov/awardsearch/showAward?AWD_ID=1550707) [![NSF-1541002](https://img.shields.io/badge/NSF-1541002-blue.svg)](https://nsf.gov/awardsearch/showAward?AWD_ID=1541002) [![NSF-2410961](https://img.shields.io/badge/NSF-2410961-blue.svg)](https://nsf.gov/awardsearch/showAward?AWD_ID=2410961)

# Neotoma API Implementation

This repository is intended to act as the core repository for the Neotoma API version 1.5 and greater.  The API acts as an interface between a user application and the Neotoma Postgres Database. This separation helps improve security, and lowers the data access barrier to users by providing simple URL paths, rather than requiring users to create individual SQL queries.

![A simple overview of the Neotoma API. An image of a database is connected to an icon representing the API, which is connected to an icon representing end users.](assets/api_simple_diagram.svg)

**Image Credits**: All images from the Noun Project (CC BY 3.0) -- API by SAM Designs; Database by Lewen Design; People by iconixr.

For documentation of the Neotoma Paleoecology Database see [the user manual](http://neotoma-manual.readthedocs.io/en/latest/neotoma_introduction.html) and for more information about the Neotoma community, see the [Neotoma webpage](https://www.neotomadb.org/).  Version 1 of the API is now fully deprecated and no longer resolves.

## Project Structure

There are two main branches, `production` and `develop`.  `production` is intended to be the production branch, while `develop` is the main testing and development branch. We encourage developers to use a GitFlow model of development, building from the `develop` branch, and creating new branches for features and fixes, that are then merged back to the `develop` branch.

### Project Documentation

Documentation uses the [OpenAPI standard](https://www.openapis.org/). Currently [https://api.neotomadb.org](https://api.neotomadb.org) is the home for the API, and will resolve to an [OpenAPI](https://www.openapis.org/) landing page with API documentation and search functionality. The documentation is generated dynamically from the [openapi.yaml](openapi.yaml) yaml file using the OpenAPI standard.

The full yaml file is over 3000 lines long. To help with maintainability each sub-component is found within the [`openapi`](./openapi/) folder, further subdivided by version number, path, and parameters. The JavaScript file [`build-openapi.js`](./openapi/scripts/build-openapi.js) is used to compile these files together using the [OpenAPI template](./openapi/openapi-template.yaml), saving it as `openapi.yaml`. A user can automatically re-build the OpenAPI documentation using:

```bash
yarn run build:openapi
```

The final `openapi.yaml` is the file that is used for documentation and for testing.

### Testing

Tests for the API are implemented using mocha/chakram and also make use of [`oatts`](https://github.com/google/oatts), which generates tests directly from the [openapi.yaml](openapi.yaml) documentation. To autogenerate the test suite, we use the bash script `genoatt.sh`, which provides base-level implementation of the `oatts` module, along with some fixes to modify values in the testing suite to ensure consistency with the API.  Once the tests have been generated we use `runmochabatch.sh` which tests each module and returns an HTML file (placed in the `public/` folder) that can be used to examine individual structural errors in the API (or documentation).

## Development

* [Simon Goring](http://goring.org): University of Wisconsin - Madison [![orcid](https://img.shields.io/badge/orcid-0000--0002--2700--4605-brightgreen.svg)](https://orcid.org/0000-0002-2700-4605)
* Mike Stryker: Pennsylvania State University

## Contribution

We welcome user contributions to this project.  All contributors are expected to follow the [code of conduct](https://github.com/Neotomadb/api_nodetest/blob/master/code_of_conduct.md).  Contributors should fork this project and make a pull request indicating the nature of the changes and the intended utility.  Further information for this workflow can be found on the GitHub [Pull Request Tutorial webpage](https://help.github.com/articles/about-pull-requests/).

## Description

This codebase is generated using `node.js`, `express` and `pg-promise` to interact with the Neotoma `postgres` database. The API endpoints are organized conceptually by applications (apps), data, and direct access to specific tables (dbtables). This project is based on and replaces an existing API implemented with .NET and SQLServer.

### Required Files/Services

#### Database Snapshot

The code in this repository is run directly against the production database on the Neotoma servers at the Center for Environmental Informatics at Penn State.  It is possible to run this repository on a local server (on your own machine) or on a remote server (using cloud services or a university server) by installing Postgres and restoring one of the [Neotoma Database Snapshots](https://www.neotomadb.org/snapshots).  If you are planning to run the application in this way, please ensure that you have set appropriate security measures, and have these documented in the `db_connect.json` file, as described below.

#### Connection File

Along with the files in this repository a user will need a file called `.env`, to be located in the main directory. We include a `.env-template` file for convenience.

```bash
NODE_ENV=development
APIPORT=3001
RDS_HOSTNAME=localhost
RDS_USERNAME=your_postgres_username
RDS_DATABASE=neotoma
RDS_PASSWORD=your_postgres_password
RDS_PORT=your_postgres_port
LOCALLIMIT=false
SSL_CERT=true
NATIVELANDKEY=your_key_for_native-lands.ca
```

Enter your secure information into the `.env-template` file, and then save it as `.env` to enable your connection to the Neotoma Database.

### To Run

To start the server locally you must first clone the repository.  Once the repository is cloned you must use the `yarn` package installer to download the required packages.  The required packages are listed in `package.json`.  You can use the command `yarn install` to install the packages locally.

Once the directory is set up and the packages have been installed, use `yarn run start` to start the server locally.  This will create a local server, serving data to `localhost:3001`.

```
$ yarn start

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

The router is in [`routes/data.js`](https://github.com/NeotomaDB/api_nodetest/blob/master/v2.0/routes/data.js). It lets us know what function and parameters are associated with each URL route.

For example, someone calling our API using: [`https://api.neotomadb.org/v2.0/data/sites/132/contacts`](http://api.neotomadb.org/v2.0/data/sites/132/contacts) would be directed to the function defined in the `handler.js` file called `contactsbysiteid`, since our routing file includes the call: [`router.get('/sites/:siteid/contacts', handlers.contactsbysiteid);`](https://github.com/NeotomaDB/api_nodetest/blob/master/v2.0/routes/data.js#L20).  We also know that within the `contactsbysiteid()` function (in `helpers/contacts`) there would be a parameter called `siteid`.

## Funding

This work is funded by NSF grants to Neotoma: NSF Geoinformatics - [1550707](https://www.nsf.gov/awardsearch/showAward?AWD_ID=1550707&HistoricalAwards=false)/[1948926](https://www.nsf.gov/awardsearch/showAward?AWD_ID=1948926&HistoricalAwards=false)/[2410961](https://nsf.gov/awardsearch/showAward?AWD_ID=2410961) and NSF EarthCube [1541002](https://www.nsf.gov/awardsearch/showAward?AWD_ID=1541002&HistoricalAwards=false).
