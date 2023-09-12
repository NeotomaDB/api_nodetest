// get global database object
var dbtest = require('../../../database/pgp_db').dbheader;

const { sql } = require('../../../src/neotomaapi.js');

const geochronbydatasetidsql = sql('./geochronologybydatasetid.sql');
const datasetpissql = sql('./datasetpis.sql');

function geochronologies (req, res, next) {
  let db = dbtest(req)
  var datasetId = parseInt(req.query.datasetid, 10);

  if (!datasetId || isNaN(datasetId)) {
    res.status(200)
      .type('application/json')
      .jsonp({
        success: 0,
        status: 'failure',
        data: null,
        message: 'No datasetid provided.'
      })
  } else {
    db.task(function(t) {
      return t.batch([
        // Dataset 0
        t.any(geochronbydatasetidsql, [datasetId]),
        // PI's 1
        t.any(datasetpissql, [datasetId])
      ])
    })
      .then(function (data) {
        var dataset = {}
        dataset['samples'] = data[0].map(function (s) {
          return s.samples;
        });
        dataset['datasetpis'] = data[1].map(function (p) {
          return p.datasetpis;
        });
        res.status(200)
          .jsonp({
            success: 1,
            status: 'success',
            data: dataset,
            message: 'Retrieved geochronology by dataset and dataset pis'
          });
      })
      .catch(function (err) {
        console.log('Error in apps geochronologies:', err.message || err);
        next(err);
      });
  }
}

module.exports.geochronologies = geochronologies;
