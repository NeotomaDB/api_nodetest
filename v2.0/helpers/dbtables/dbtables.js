// Returns the data tables:

// get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;

// Defining the query function:

function dbtables (req, res, next) {
  var tableparam = !!req.query.table;

  console.log(req.query)

  if (tableparam) {
    var queryTable = { queryTable: 'ndb.' + String(req.query.table).toLowerCase().replace(/\s/g, '') };
    var query = 'SELECT * FROM ${queryTable:raw};'
  } else {
    query = "SELECT tablename FROM pg_tables WHERE schemaname='ndb';";
  }
  console.log(query)

  db.any(query, queryTable)
    .then(function (data, queryTable) {
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
