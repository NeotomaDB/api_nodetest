// Returns the data tables:

// get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;

const { sql, commaSep, validateOut, getparam, ifUndef } = require('../../../src/neotomaapi.js');

// Defining the query function:

function dbtables (req, res, next) {
  let paramgrab = getparam(req)

  if (!paramgrab.success) {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: paramgrab.message
      });
  } else {
    var resultset = paramgrab.data

    var outobj = {
      'table': ifUndef(resultset.table, 'string'),
      'limit': ifUndef(resultset.limit, 'int'),
      'offset': ifUndef(resultset.offset, 'int')
    };
  }

  if (outobj.table) {
    outobj.table = 'ndb.' + outobj.table.toLowerCase().replace(/\s/g, '');
    var query = 'SELECT * FROM ${table:raw} OFFSET (CASE WHEN ${offset} IS NULL THEN 0 ELSE ${offset} END) LIMIT (CASE WHEN ${limit} IS NULL THEN 25 ELSE ${limit} END);'
  } else {
    query = "SELECT tablename FROM pg_tables WHERE schemaname='ndb';";
  }

  db.any(query, outobj)
    .then(function (data, queryTable) {
      if (outobj.table) {
        data = data;
      } else {
        data = data.map(x => x.tablename);
      }
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      if (err.message.includes('does not exist')) {
        res.status(200)
          .json({
            status: 'success',
            data: [],
            message: err.message
          });
      } else {
        res.status(500)
          .json({
            status: 'failure',
            data: err.message,
            message: 'Ran into an error.'
          });
      }
    });
};

module.exports.dbtables = dbtables;
