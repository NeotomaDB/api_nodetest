// Returns the data tables:

//get global database object
var db = require('../../database/pgp_db');
var pgp = db.$config.pgp;

// Defining the query function:

function dbtables(req, res, next) {

  if (!!req.query.table) {
    var query = 'SELECT * FROM ndb.' + req.query.table + ';'
  } else {
    var query = "SELECT tablename FROM pg_tables WHERE schemaname='ndb';";
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
      next(err);
    });
};

module.exports.dbtables = dbtables;