
function frozenbyid (req, res, next) {
  let db = req.app.locals.db
  var datasetid = String(req.params.datasetid)

  db.any('SELECT download FROM doi.frozen WHERE datasetid = $1', [datasetid])
    .then(function (data) {
      if (data.length === 0) {
        // We're returning the structure, but nothing inside it:
        var returner = 'There is no frozen record for this dataset.  Contact Neotoma Maintainers if you believe this record should have an associated frozen record.'
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

module.exports.frozenbyid = frozenbyid;
