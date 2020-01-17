// get global database object
var db = require('../../database/pgp_db');
var pgp = db.$config.pgp;

module.exports = {
  relativeagescales: relativeagescales,
  table: table,
  tablenames: tablenames
};

// Defining the query functions:

/* All the Endpoint functions */

function relativeagescales (req, res, next) {
  db.query('select ndb.getrelativeagescales();')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: JSON.stringify(data),
          message: 'Retrieved all RelativeAgeScales'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


function table (req, res, next) {
  db.query('SELECT * FROM ndb.' + req.table + ';')
    .then(function (data) {
      res.status(200)
      .json({
        status: 'success',
        data: JSON.stringify(data),
        message: 'Retrieved all RelativeAgeScales'
      });
  })
  .catch(function (err) {
    return next(err);
  });
}

function tablenames (req, res, next) {
  db.query('SELECT * FROM pg_catalog.pg_tables where schemaname="ndb";')
    .then(function (data) {
      res.status(200)
      .json({
        status: 'success',
        data: JSON.stringify(data),
        message: 'Retrieved all RelativeAgeScales'
      });
  })
  .catch(function (err) {
    return next(err);
  });
}
