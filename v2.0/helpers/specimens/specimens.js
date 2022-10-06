// Building and returning the specimen objects.
// Currently returns only for specimen selection using dataset IDs.
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;

const {
  sql,
  commaSep
} = require('../../../src/neotomaapi.js');

const specimendssql = sql('../v2.0/helpers/specimens/specbydsid.sql');
const specimensql = sql('../v2.0/helpers/specimens/specbyid.sql');

function specimenbyid (req, res, next) {
  var spIdUsed = !!req.params.specimenid;

  if (spIdUsed) {
    var specimenid = commaSep(req.params.specimenid);
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass either queries or a comma separated integer sequence.'
      });
  }

  db.any(specimensql, [specimenid])
    .then(function (data) {
      var returner = data.map(x => {
        if (x.length === 0) {
          // We're returning the structure, but nothing inside it:
          var returner = [];
        } else {
          returner = x
        }
        return returner;
      })
      res.status(200)
        .json({
          status: 'success',
          data: returner,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: err.message
        });
    });
}

function specimenbydsid (req, res, next) {
  var dsIdUsed = !!req.params.datasetid;
  if (dsIdUsed) {
    var datasetid = commaSep(req.params.datasetid);
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass either queries or a comma separated integer sequence.'
      });
  }

  db.any(specimendssql, [datasetid])
    .then(function (data) {
      var returner = data.map(x => {
        if (x.length === 0) {
          // We're returning the structure, but nothing inside it:
          var returner = [];
        } else {
          returner = x
        }
        return returner;
      })
      res.status(200)
        .json({
          status: 'success',
          data: returner,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: err.message
      });
    });
}

module.exports.specimenbydsid = specimenbydsid;
module.exports.specimenbyid = specimenbyid;
