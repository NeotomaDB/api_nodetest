// Taxa query:

// This returns an empty object in the case of error.  I might propagate this to other
// endpoints.

var empty = {
  "query":{   'taxonid':null,
                   'name':null,
              'ecolgroup':null,
                  'lower':null
            },
  "response":{
              "taxonid": null,
            "taxoncode": null,
            "taxonname": null,
               "author": null,
                "valid": null,
        "highertaxonid": null,
              "extinct": null,
          "taxagroupid": null,
        "publicationid": null,
          "validatorid": null,
         "validatedate": null,
                "notes": null
    }};
// Sites query:

const path = require('path');

var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var ctStr = require("../../db_connect.json");
const bib   = require('./../bib_format');

// Connecting to the database:
var db = pgp(ctStr);

// Helper for linking to external query files:
function sql(file) {
    const fullPath = path.join(__dirname, file);
    return new pgp.QueryFile(fullPath, {minify: true});
}

// Create a QueryFile globally, once per file:
const taxonquerylower  = sql('./taxonquerylower.sql');
const taxonquerystatic = sql('./taxonquerystatic.sql');

// Actual functions:
// 
function gettaxa(req, res, next) {
  
  var taxonid = String(req.params.taxonid).split(',').map(function(item) {
    return parseInt(item, 10);
  });

  if (!!taxonid) {
    query = 'SELECT * FROM ndb.taxa WHERE taxa.taxonid IN ($1:csv)';
  } else {

    res.status(500)
        .json({
          status: 'failure',
          data: empty,
          message: 'Must pass either queries or an integer sequence.'
        });
  }

  db.any(query, [taxonid])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
        return next(err);
    });
}

function gettaxonquery(req, res, next) {

  var outobj = {'taxonid':null,
              'taxonname':req.query.taxonname,
                 'status':req.query.status,
              'taxagroup':req.query.taxagroup,   
              'ecolgroup':req.query.ecolgroup,
                  'lower':req.query.lower
               };

  if (!!req.query.taxonid) {
    outobj.taxonid = String(req.query.taxonid).split(',').map(function(item) {
      return parseInt(item, 10);
    });
  };

  console.log(outobj);

  if(outobj.lower === 'true') {
    db.any(taxonquerylower, outobj)
      .then(function (data) {

        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved all tables'
          });
      })
      .catch(function (err) {
          return next(err);
      });
  };

  if(typeof outobj.lower === 'undefined') {
    db.any(taxonquerystatic, outobj)
      .then(function (data) {

        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved all tables'
          });
      })
      .catch(function (err) {
          return next(err);
      });
  };
}

module.exports.gettaxa = gettaxa;
module.exports.gettaxonquery = gettaxonquery;