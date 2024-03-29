// Occurrences query:
'use strict';

const Terraformer = require('terraformer');
const he = require('he');
const WKT = require('terraformer-wkt-parser');
const parseTaxa = require('../parsetaxa.js').parseTaxa;

// get global database object

const {sql, ifUndef, validateOut, getparam} = require('../../../src/neotomaapi.js');

const occurrencequerysql = sql('../v2.0/helpers/occurrence/occurrencequery.sql');
const occurrencerecursquerysql = sql('../v2.0/helpers/occurrence/occurrence_recurs_query.sql');
const occurrencetaxonquerysql = sql('../v2.0/helpers/occurrence/occurrencebytaxon.sql');

/**
 * Query Neotoma for Occurrence Data
 * @param {req} req An expressjs `request` object.
 * @param {res} res A valid expressjs `res` object.
 * @param {any} next
 */
function occurrencequery(req, res, next) {
  const db = req.app.locals.db;
  // The broader query:

  const paramgrab = getparam(req);

  if (!paramgrab.success) {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: paramgrab.message,
        });
  } else {
    const resultset = paramgrab.data;

    // Get the input parameters:
    let outobj = {
      'occurrenceid': ifUndef(resultset.occurrenceid, 'sep'),
      'sitename': String(resultset.sitename),
      'altmin': parseInt(String(resultset.altmin)),
      'altmax': parseInt(String(resultset.altmax)),
      'loc': he.decode(String(resultset.loc)),
      'gpid': ifUndef(resultset.gpid, 'sep'),
      'taxonid': ifUndef(resultset.taxonid, 'sep'),
      'taxonname': resultset.taxa,
      'taxondrop': resultset.drop,
      'lower': resultset.lower,
      'siteid': ifUndef(resultset.siteid, 'sep'),
      'datasettype': String(resultset.datasettype),
      'piid': ifUndef(resultset.piid, 'sep'),
      'ageold': parseInt(String(resultset.ageold)),
      'ageyoung': parseInt(String(resultset.ageyoung)),
      'offset': resultset.offset,
      'limit': resultset.limit,
    };

    outobj = validateOut(outobj);

    if (!(typeof outobj.taxonname === 'undefined') & !outobj.taxonname === null) {
      // Adding in or replacing any stars in the name to allow wildcards.
      outobj.taxonname = outobj.taxonname.map(function(x) {
        const gbg = x.replace(/\*/g, '%');
        return gbg;
      });
    }

    if (outobj.altmin > outobj.altmax & !!outobj.altmax & !!outobj.altmin) {
      res.status(500)
          .json({
            status: 'failure',
            message: 'The altmin is greater than altmax.  Please fix this!',
          });
      return;
    }

    if (outobj.ageyoung > outobj.ageold & !!outobj.ageyoung & !!outobj.ageold) {
      res.status(500)
          .json({
            status: 'failure',
            message: 'ageyoung is greater than ageold.  Please fix this!',
          });
      return;
    }

    const goodloc = !!outobj.loc;

    if (goodloc) {
      try {
        var newloc = JSON.parse(outobj.loc);
        newloc = WKT.convert(JSON.parse(outobj.loc));
      } catch (err) {
        newloc = outobj.loc;
      }
      outobj.loc = newloc;
    }

    const goodlower = !!outobj.lower;
    const goodtaxa = !!outobj.taxonname || !!outobj.taxonid;

    if (goodtaxa & goodlower & outobj.lower === 'true') {
      db.any(occurrencerecursquerysql, outobj)
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
                  params: outobj,
                });
          });
    } else {
      db.any(occurrencequerysql, outobj)
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
                  params: outobj,
                });
          });
    }
  }
};

function occurrencebytaxon(req, res, next) {
  const db = req.app.locals.db;
  const taxonIdUsed = !!req.params.taxonid;
  if (taxonIdUsed) {
    var taxonlist = ifUndef(req.params.taxonid, 'sep');
  } else {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: 'Must pass either queries or an integer sequence.',
        });
  }

  db.any(occurrencetaxonquerysql, [taxonlist])
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
              message: 'Must pass either queries or a comma separated integer sequence.',
            });
      });
};

module.exports.occurrencequery = occurrencequery;
module.exports.occurrencebytaxon = occurrencebytaxon;
