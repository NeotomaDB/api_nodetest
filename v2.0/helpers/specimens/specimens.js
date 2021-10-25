// Building and returning the specimen objects.
// Currently returns only for specimen selection using dataset IDs.
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;

const {
  sql,
  commaSep
} = require('../../../src/neotomaapi.js');

const specimensql = sql('../v2.0/helpers/specimens/specbydsid.sql');

function specimenbyid (req, res, next) {
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

  db.any(specimensql, [datasetid])
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
      next(err);
    });
}

module.exports.specimenbyid = specimenbyid;
