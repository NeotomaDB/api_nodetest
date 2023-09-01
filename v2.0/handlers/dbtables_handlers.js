// get global database object
const dbtest = require('../../database/pgp_db').dbheader
const { ifUndef, getparam } = require('../../src/neotomaapi.js');

module.exports = {
  ndbtable: getNDBtable,
  tablenames: tablenames
};

// Defining the query functions:

/* All the Endpoint functions */

function getNDBtable (req, res, next) {
  var db = dbtest(req)
  let paramgrab = getparam(req)

  if (!paramgrab.success) {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: paramgrab.message
      });
  }

  let resultset = paramgrab.data
  let outobj = {
    'table': ifUndef(resultset.table, 'string'),
    'limit': ifUndef(resultset.limit, 'int'),
    'offset': ifUndef(resultset.offset, 'int')
  }

  if (!outobj.table) {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass a table name parameter to the API.'
      });
  }

  if (outobj.limit == null) {
    outobj.limit = 25;
  }

  if (outobj.offset == null) {
    outobj.offset = 0;
  }
  console.log(outobj)

  db.query("SELECT * FROM ndb.${table:name} LIMIT ${limit} OFFSET ${offset};", outobj)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: { query: outobj, data: data },
          message: 'Retrieved rows from ' + req.query.table
        });
    })
    .catch(function (err) {
      res.status(500)
        .json({
          status: 'failure',
          data: err.message
        });
    });
}

function tablenames (req, res, next) {
  var db = dbtest(req)
  db.query("SELECT tablename FROM pg_catalog.pg_tables where schemaname='ndb';")
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data.map(x => x['tablename']).sort(),
          message: 'Retrieved all tablenames for Neotoma.'
        });
    })
    .catch(function (err) {
      res.status(500)
        .json({
          status: 'failure',
          data: err.message
        });
    });
}
