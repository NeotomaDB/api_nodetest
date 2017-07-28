// Taxa query:

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


var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var ctStr = require("../../db_connect.json");
const bib   = require('./../bib_format');

// For the empty responses (automatically drops if any of these are true & returns false:
function checkProperties(obj) {
    for (var key in obj) {
      console.log(obj[key])
        if (obj[key] !== null && obj[key] != "" && typeof(obj[key]) !== 'undefined')
            return false;
    }
    return true;
}

// Connecting to the database:
var db = pgp(ctStr);

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

  var outobj = {'taxonid':req.query.taxonid,
              'taxonname':req.query.taxonname,
                 'status':req.query.status,
              'taxagroup':req.query.taxagroup,   
              'ecolgroup':req.query.ecolgroup,
                  'lower':req.query.lower
               };

  var empty_test = checkProperties(outobj);

  if (empty_test) {

    res.status(500)
        .json({
          status: 'failure',
          data: empty,
          message: 'Must pass either queries or an integer sequence.'
        });
  }

  var query = 'WITH taxid AS ' +
              '(SELECT * FROM ndb.taxa AS taxa WHERE ' +
              '(${taxonid} IS NULL OR taxa.taxonid = ${taxonid}) ' +
              'AND (${taxonname} IS NULL OR taxa.taxonname LIKE ${taxonname}) ' +
              'AND (${status} IS NULL OR taxa.extinct'
              'AND (${taxagroup} IS NULL OR taxa.taxagroupid = ${taxagroup})) ' +
              'SELECT * FROM taxid ' +
              'UNION ALL ' +
              'SELECT * FROM ndb.taxa AS taxa ' +
              'WHERE (${lower} IS true AND taxa.highertaxonid IN ' +
              '(SELECT taxonid FROM taxid));';

console.log(outobj);

  db.any(query, outobj)
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

module.exports.gettaxa = gettaxa;
module.exports.gettaxonquery = gettaxonquery;