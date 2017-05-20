# Neotoma API Template

This repository is intended to act as the core repository for the Neotoma API.  There are two main branches.  `master` and `dev`.  Master is intended as the production branch, while `dev` is the main testing and development branch.

# Development

* Simon Goring [http://goring.org]()
* Mike Stryker

# Contribution

We welcome open contribution to this project.  All contributors are expected to follow the [code of conduct](https://github.com/Neotomadb/api_nodetest/blob/master/code_of_conduct.md).  Contributors should fork this project and make a pull request indicating the nature of the changes and the intended utility.

# Description

This codebase is generated using `node.js` and `express`, to interact with the Neotoma `postgres` database.

This code is currently in preliminary release.

## Required Files

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

# Funding

This work is funded by NSF grants to Neotoma: NSF Geoinformatics - [1550707](https://www.nsf.gov/awardsearch/showAward?AWD_ID=1550707&HistoricalAwards=false) and NSF EarthCube [1541002](https://www.nsf.gov/awardsearch/showAward?AWD_ID=1541002&HistoricalAwards=false).