// get global database object
var db = require('../../database/pgp_db');
var pgp = db.$config.pgp;

module.exports = {
// RETURNING DATASETTYPES
//  dataset: function (req, res, next) {
//    var dataset = require('./helpers/datasets.js');
//    dataset.datasetbyid(req, res, next);
  relativeagescales: relativeagescales
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
