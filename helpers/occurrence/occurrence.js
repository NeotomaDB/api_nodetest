// Occurrences query:

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

const occurrencequerysql = sql('./occurrencequery.sql');

function occurrencequery(req, res, next) {
 
  // Get the input parameters:
  var outobj = {'sitename':String(req.query.sitename),
                  'altmin':parseInt(String(req.query.altmin)),
                  'altmax':parseInt(String(req.query.altmax)),
                     'loc':String(req.query.loc),
                    'gpid':String(req.query.gpid)
                                .split(',')
                                .map(function(item) {
                                  return parseInt(item, 10);
                                }),
                    'taxonid':String(req.query.taxonid)
                                .split(',')
                                .map(function(item) {
                                  return parseInt(item, 10);
                                }),
                    'taxonname':String(req.query.taxonname),
                    'siteid':String(req.query.siteid)
                                .split(',')
                                .map(function(item) {
                                  return parseInt(item, 10);
                                }),
                    'datasettype':String(req.query.datasettype),
                    'piid':String(req.query.piid)
                                .split(',')
                                .map(function(item) {
                                  return parseInt(item, 10);
                                }),
                    'loc':String(req.query.loc),
                    'age':req.query.age,
                    'ageold':req.query.ageold,
                    'ageyoung':req.query.ageyoung,
                    'offset':req.query.offset,
                    'limit':req.query.limit
               };

  // Clear variables to set to null for pg-promise:
  for(key in outobj){
    if(!Object.keys(req.query).includes(key)){
      outobj[key] = null;
    }
  };

  if (outobj.altmin > outobj.altmax & !!outobj.altmax & !!outobj.altmin) {
    res.status(500)
      .json({
        status: 'failure',
        message: 'The altmin is greater than altmax.  Please fix this!'
      });

  }

  console.log([outobj]);

  db.any(occurrencequerysql, outobj)
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

module.exports.occurrencequery = occurrencequery;