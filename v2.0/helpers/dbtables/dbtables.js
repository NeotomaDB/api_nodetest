// Returns the data tables:

// get global database object
var db = require('../../../database/pgp_db'));
var pgp = db.$config.pgp;

// Defining the query function:

function dbtables (req, res, next) {
  var tableparam = !!req.params.table;

  if (tableparam) {
    var query = 'SELECT * FROM ndb.' + req.params.table + ';'
  } else {
    query = "SELECT tablename FROM pg_tables WHERE schemaname='ndb';";
  }


  db.any(query)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: 'Retrieved all tables'
        });
    });
};

module.exports.dbtables = dbtables;
