const bib   = require('../helpers/bib_format');
//db connection pool
var db = require('../database/pgp_db');






  module.exports = {
// RETURNING DATASETTYPES
//  dataset: function (req, res, next) { 
//    var dataset = require('./helpers/datasets.js');
//    dataset.datasetbyid(req, res, next); 
  relativeagescales: relativeagescales
};



// Defining the query functions:

/* All the Endpoint functions */



function relativeagescales(req, res, next) {
  // Get the query string:
  var query = {};

   // db.any('select ap.getdatasettypes();')
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



