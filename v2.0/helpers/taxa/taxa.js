// Taxa query:
'use strict';
const {sql, ifUndef} = require('../../../src/neotomaapi.js');
const {getparam, checkObject} = require('../../../src/neotomaapi.js');

// Create a QueryFile globally, once per file:
const taxonsqlr = sql('../v2.0/helpers/taxa/taxonquery_recurs.sql');
const taxonsql = sql('../v2.0/helpers/taxa/taxonquery.sql');
const taxonbyds = sql('../v2.0/helpers/taxa/taxonquerydsid.sql');

/**
 * Actual functions:
 * @param {object} req An object passed through Express
 * @param {object} res A resolve object passed through Express
 * @param {object} next A next object passed through Express */
function taxonbydsid(req, res, next) {
  const db = req.app.locals.db;
  let datasetid = null;

  const goodds = !!req.params.datasetid;
  if (goodds) {
    datasetid = String(req.params.datasetid)
        .split(',')
        .map(function(item) {
          return parseInt(item, 10);
        });
  } else {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: 'Must pass either queries or an integer sequence.'
        });
  }

  db.any(taxonbyds, [datasetid])
      .then(function(data) {
        res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Retrieved all tables',
            });
      })
      .catch(function(err) {
        res.status(500)
            .json({
              status: 'failure',
              data: err.message,
            });
      });
}

function taxonquery (req, res, next) {
  let db = req.app.locals.db

  // First get all the inputs and parse them:
  let paramgrab = getparam(req)

  if (!paramgrab.success) {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: paramgrab.message
      });
  } else {
    var resultset = paramgrab.data
    var outobj = {
      'taxonid': ifUndef(resultset.taxonid, 'sep'),
      'taxonname': ifUndef(resultset.taxonname, 'sep'),
      'status': ifUndef(resultset.status, 'int'),
      'taxagroup': ifUndef(resultset.taxagroup, 'sep'),
      'ecolgroup': ifUndef(resultset.ecolgroup, 'sep'),
      'lower': ifUndef(resultset.lower, 'string'),
      'limit': ifUndef(resultset.limit, 'int'),
      'offset': ifUndef(resultset.offset, 'int')
    }

    if (outobj.lower === null) {
      outobj.lower = false
    } else {
      if (outobj['lower'].match(/[Tt](RUE|rue){0,1}/)) {
        outobj.lower = true
      }
    }

    if (!(outobj.taxonname === null)) {
      // Replacing any asterisks with percent signs to ensure wildcards work.
      outobj.taxonname = outobj['taxonname'].map((x) => {
        return x.replace(/\*/g, '%')
      });
    }

    const taxa = 'SELECT taxonid AS output FROM ndb.taxa WHERE taxonname ILIKE ANY(${taxonname})';

    Promise.all([checkObject(req, res, taxa, outobj.taxonname, outobj)])
      .then(result => {
        if (outobj.taxonid === null) {
          outobj.taxonid = result[0]
        } else {
          if (!result[0] === null) {
            outobj.taxonid.push(result[0])
          }
        }

        db.any(taxonsql, outobj)
          .then(function (data) {
            if (outobj.lower) {
              outobj.taxonid = data.map(x => x.taxonid)
              data = db.any(taxonsqlr, outobj)
                .then(function (data) { return data })
            }
            return data;
          })
          .catch(function (err) {
            res.status(500)
              .json({
                status: 'failure',
                data: err.message
              });
          })
          .then(function (data) {
            res.status(200)
              .json({
                status: 'success',
                data: data,
                message: 'Retrieved all tables'
              });
          })
      })
      .catch(function (err) {
        res.status(500)
          .json({
            status: 'failure',
            data: null,
            message: err.message
          });
      })
  }
}

module.exports.taxonquery = taxonquery;
module.exports.taxonbydsid = taxonbydsid;
