'use strict';

// Sites query:
const {any} = require('bluebird');
const he = require('he');

// Helper for linking to external query files:
const {
  sql, commaSep,
  ifUndef, checkObject,
  getparam, parseLocations} = require('../../../src/neotomaapi.js');

// Create a QueryFile globally, once per file:
const siteQuery = sql('../v2.0/helpers/sites/sitequeryfaster.sql');
const sitebydsid = sql('../v2.0/helpers/sites/sitebydsid.sql');
const sitebyid = sql('../v2.0/helpers/sites/sitebyid.sql');
const sitebygpid = sql('../v2.0/helpers/sites/sitebygpid.sql');
const sitebyctid = sql('../v2.0/helpers/sites/sitebyctid.sql');

/**
 * Call sites using the site ID.
 * @param {req} req An Express request object.
 * @param {res} res An Express response object.
 * @param {next} next An Express "next" object.
 */
function sitesbyid(req, res, next) {
  const db = req.app.locals.db;
  const goodstid = !!req.params.siteid;

  if (goodstid) {
    const siteid = commaSep(req.params.siteid);
    db.any(sitebyid, [siteid])
        .then(function(data) {
          res.status(200)
              .json({
                status: 'success',
                data: data,
                message: 'Retrieved all tables',
              });
        })
        .catch(function(err) {
          return res.status(500)
              .json({
                status: 'failure',
                message: err.message,
                query: [siteid],
              });
        });
  } else {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: 'Must pass either queries or an integer sequence.',
        });
  }
}

/**
 * Call sites with a range of parameters.
 * @param {req} req An Express request object.
 * @param {res} res An Express response object.
 * @param {next} next An Express "next" object.
 * @return {null}
 */
function sitesquery(req, res, next) {
  const db = req.app.locals.db;
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
    const outobj = {
      'ageof': ifUndef(resultset.ageof, 'int'),
      'ageold': ifUndef(resultset.ageold, 'int'),
      'ageyoung': ifUndef(resultset.ageyoung, 'int'),
      'altmax': ifUndef(resultset.altmax, 'int'),
      'altmin': ifUndef(resultset.altmin, 'int'),
      'contacts': ifUndef(resultset.contacts, 'sep'),
      'database': ifUndef(resultset.database, 'sep'),
      'datasetid': ifUndef(resultset.datasetid, 'sep'),
      'datasettype': ifUndef(resultset.datasettype, 'string'),
      'doi': ifUndef(resultset.doi, 'sep'),
      'gpid': ifUndef(resultset.gpid, 'sep'),
      'keywords': ifUndef(resultset.keywords, 'sep'),
      'limit': ifUndef(resultset.limit, 'int'),
      'loc': ifUndef(resultset.loc, 'string'),
      'maxage': ifUndef(resultset.maxage, 'int'),
      'minage': ifUndef(resultset.minage, 'int'),
      'offset': ifUndef(resultset.offset, 'int'),
      'siteid': ifUndef(resultset.siteid, 'sep'),
      'sitename': ifUndef(resultset.sitename, 'sep'),
      'taxa': ifUndef(resultset.taxa, 'sep'),
    };

    if (outobj.keywords === null) {
      outobj.keywords = ifUndef(resultset.keyword, 'sep');
    }

    if (outobj.loc) {
      outobj.loc = he.decode(outobj.loc);
    }
    if (outobj.altmin > outobj.altmax & !!outobj.altmax & !!outobj.altmin) {
      return res.status(500)
          .json({
            status: 'failure',
            message: 'The altmin is greater than altmax.  Please fix this!',
          });
    } else {
      const goodloc = !!outobj.loc;

      if (goodloc) {
        // For the PostGIS query we need the result in WKT format
        //  but we accept it in geoJSON or WKT.
        try {
          outobj.loc = parseLocations(outobj.loc);
        } catch (err) {
          return res.status(500)
              .json({
                status: 'failure',
                message: 'The spatial object passed in loc is ' +
                          'not parsing properly. Is it valid WKT/geoJSON?',
              });
        }
      }

      /* Here's the actual call */
      const geopol = 'SELECT geopoliticalid AS output ' +
                     'FROM ndb.geopoliticalunits ' +
                     'WHERE geopoliticalname ILIKE ANY(${gpid});';
      const taxa = 'SELECT taxonid AS output ' +
                   'FROM ndb.taxa ' +
                   'WHERE taxonname ILIKE ANY(${taxa})';
      const contacts = 'SELECT contactid AS output ' +
                       'FROM ndb.contacts ' +
                       'WHERE contactname ILIKE ANY(${contacts});';
      const keyword = 'SELECT keywordid AS output ' +
                      'FROM ndb.keywords ' +
                      'WHERE keyword ILIKE ANY(${keywords})';

      Promise.all([checkObject(req, res, geopol, outobj.gpid, outobj),
        checkObject(req, res, keyword, outobj.keywords, outobj),
        checkObject(req, res, taxa, outobj.taxa, outobj),
        checkObject(req, res, contacts, outobj.contacts, outobj)])
          .then((result) => {
            outobj.gpid = result[0];
            outobj.keywords = result[1];
            outobj.taxa = result[2];
            outobj.contacts = result[3];
            db.any(siteQuery, outobj)
                .then(function(data) {
                  res.status(200)
                      .json({
                        status: 'success',
                        data: data,
                        message: 'Retrieved all tables',
                      });
                })
                .catch(function(err) {
                  return res.status(500)
                      .json({
                        status: 'failure',
                        message: err.message,
                        query: outobj,
                      });
                });
          });
    }
  }
}

/**
 * Call sites using the dataset ID.
 * @param {req} req An Express request object.
 * @param {res} res An Express response object.
 * @param {next} next An Express "next" object.
 */
function sitesbydataset(req, res, next) {
  const db = req.app.locals.db;

  const paramgrab = getparam(req);
  let resultset = null;
  let datasetid = null;

  if (!paramgrab.success) {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: paramgrab.message,
        });
  } else {
    resultset = paramgrab.data;
  }

  if (Object.keys(resultset).indexOf('datasetid') !== -1) {
    datasetid = commaSep(resultset.datasetid);
  } else {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: 'Must pass either queries or an integer sequence.',
        });
  }

  db.any(sitebydsid, [datasetid])
      .then(function(data) {
        res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Retrieved all tables',
            });
      })
      .catch(function(err) {
        return res.status(500)
            .json({
              status: 'failure',
              message: err.message,
              query: datasetid,
            });
      });
}

/**
 * Call sites using the geopolitical identifier.
 * @param {req} req An Express request object.
 * @param {res} res An Express response object.
 * @param {next} next An Express "next" object.
 */
function sitesbygeopol(req, res, next) {
  const db = req.app.locals.db;
  const goodgp = !!req.params.gpid;

  if (!goodgp) {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: 'Must pass either queries or an integer sequence.',
        });
  }

  const gpid = {gpid: commaSep(req.params.gpid)};

  if (req.query.limit) {
    gpid.limit = req.query.limit;
  } else {
    gpid.limit = 25;
  }

  if (req.query.offset) {
    gpid.offset = req.query.offset;
  } else {
    gpid.offset = 25;
  }

  db.any(sitebygpid, gpid)
      .then(function(data) {
        res.status(200)
            .json({
              status: 'success',
              query: gpid,
              data: data,
              message: 'Retrieved all tables',
            });
      })
      .catch(function(err) {
        return res.status(500)
            .json({
              status: 'failure',
              message: err.message,
              query: gpid,
            });
      });
}

/**
 * Call sites using a contact name.
 * @param {req} req An Express request object.
 * @param {res} res An Express response object.
 * @param {next} next An Express "next" object.
 */
function sitesbycontact(req, res, next) {
  const db = req.app.locals.db;
  const goodctc = !!req.params.contactid;

  if (!goodctc) {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: 'Must pass either queries or an integer sequence.',
        });
  }

  const contactid = String(req.params.contactid).split(',').map(function(item) {
    return parseInt(item, 10);
  });

  db.any(sitebyctid, [contactid])
      .then(function(data) {
        res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Retrieved all tables',
            });
      })
      .catch(function(err) {
        return res.status(500)
            .json({
              status: 'failure',
              message: err.message,
              query: [contactid],
            });
      });
}

module.exports.sitesbyid = sitesbyid;
module.exports.sitesquery = sitesquery;
module.exports.sitesbydataset = sitesbydataset;
module.exports.sitesbygeopol = sitesbygeopol;
module.exports.sitesbycontact = sitesbycontact;
