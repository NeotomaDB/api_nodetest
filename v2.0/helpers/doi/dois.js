const { sql, commaSep } = require('../../../src/neotomaapi.js');

const doisql = sql('../v2.0/helpers/doi/doibydsid.sql');

function doibydsid (req, res, next) {
  let db = req.app.locals.db
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

  db.any(doisql, [datasetid])
    .then(function (data) {
      if (data.length === 0) {
        // We're returning the structure, but nothing inside it:
        var returner = [];
      } else {
        returner = data;
      };
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

module.exports.doibydsid = doibydsid;
