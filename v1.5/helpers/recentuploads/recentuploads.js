// xml parser
const js2xmlparser = require('js2xmlparser');

const { sql } = require('../../../src/neotomaapi.js');
// get recent uploads sql query
const recentuploadssql = sql('../v1.5/helpers/recentuploads/recentuploadsquery.sql');

function recentuploadsquery (req, res, next) {
  let db = req.app.locals.db
  var months = +req.params.months;

  db.any(recentuploadssql, [months])
    .then(function (data) {
      // xml parsing options
      var options = {
        declaration: {
          include: false
        },
        attributeString: 'data',
        useCDATA: true
      };

      data = js2xmlparser.parse('results', data, options);
      res.status(200).set('Content-Type', 'text/plain').send(data);
    })
    .catch(function (err) {
      next(err);
    });
}

module.exports.recentuploadsquery = recentuploadsquery;
