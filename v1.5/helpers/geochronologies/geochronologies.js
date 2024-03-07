'use strict';

const {sql} = require('../../../src/neotomaapi.js');

const geochronbydatasetidsql = sql('../v1.5/helpers/' +
  'geochronologies/geochronologybydatasetid.sql');
const datasetpissql = sql('../v1.5/helpers/geochronologies/datasetpis.sql');


/**
 * Return information about geochronological data.
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function geochronologies(req, res, next) {
  const db = req.app.locals.db;
  const datasetId = parseInt(req.query.datasetid, 10);

  if (!datasetId || isNaN(datasetId)) {
    res.status(200)
        .type('application/json')
        .jsonp({
          success: 0,
          status: 'failure',
          data: null,
          message: 'No datasetid provided.'
        });
  } else {
    db.task(function(t) {
      return t.batch([
        // Dataset 0
        t.any(geochronbydatasetidsql, [datasetId]),
        // PI's 1
        t.any(datasetpissql, [datasetId]),
      ]);
    })
        .then(function(data) {
          let dataset = {};
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
                message: 'Retrieved geochronology by dataset and dataset pis',
              });
        })
        .catch(function(err) {
          // console.log('Error in apps geochronologies:', err.message || err);
          next(err);
        });
  }
}

module.exports.geochronologies = geochronologies;
