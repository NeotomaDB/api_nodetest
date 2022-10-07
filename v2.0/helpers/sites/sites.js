// Sites query:
const { any } = require('bluebird');
const he = require('he');
const Terraformer = require('terraformer');
const WKT = require('terraformer-wkt-parser');
const { stream } = require('../../../database/pgp_db');

// get global database object
const db = require('../../../database/pgp_db');
const pgp = db.$config.pgp;

// Helper for linking to external query files:
const { sql, commaSep, ifUndef, checkObject, getparam } = require('../../../src/neotomaapi.js');

// Create a QueryFile globally, once per file:
const siteQuery = sql('../v2.0/helpers/sites/sitequeryfaster.sql');
const sitebydsid = sql('../v2.0/helpers/sites/sitebydsid.sql');
const sitebyid = sql('../v2.0/helpers/sites/sitebyid.sql');
const sitebygpid = sql('../v2.0/helpers/sites/sitebygpid.sql');
const sitebyctid = sql('../v2.0/helpers/sites/sitebyctid.sql');

/**
 * Return API results for sites when only a string of site IDs is passed in.
 * @param req The URL request
 * @param res The response object, to which the response (200, 404, 500) is sent.
 * @param next Callback argument to the middleware function (sends to the `next` function in app.js)
 * @return The function returns nothing, but sends the API result to the client.
 */

function sitesbyid (req, res, next) {
  var goodstid = !!req.params.siteid;

  if (goodstid) {
    var siteid = commaSep(req.params.siteid);
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass either queries or an integer sequence.'
      });
  }

  db.any(sitebyid, [siteid])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return res.status(500)
        .json({
          status: 'failure',
          message: err.message,
          query: [siteid]
        });
    })
}

/**
 * Return API results for sites when a set of parameters are passed in.
 * @param req The URL request
 * @param res The response object, to which the response (200, 404, 500) is sent.
 * @param next Callback argument to the middleware function (sends to the `next` function in app.js)
 * @return The function returns nothing, but sends the API result to the client.
 */
function sitesquery (req, res, next) {
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

    // Get the input parameters:
    var outobj = {
      'sitename': ifUndef(resultset.sitename, 'sep'),
      'siteid': ifUndef(resultset.siteid, 'sep'),
      'datasetid': ifUndef(resultset.datasetid, 'sep'),
      'doi': ifUndef(resultset.doi, 'sep'),
      'altmin': ifUndef(resultset.altmin, 'int'),
      'altmax': ifUndef(resultset.altmax, 'int'),
      'loc': ifUndef(resultset.loc, 'string'),
      'taxa': ifUndef(resultset.taxa, 'sep'),
      'keywords': ifUndef(resultset.keywords, 'sep'),
      'gpid': ifUndef(resultset.gpid, 'sep'),
      'contacts': ifUndef(resultset.contacts, 'sep'),
      'offset': ifUndef(resultset.offset, 'int'),
      'limit': ifUndef(resultset.limit, 'int')
    };

    if (outobj.keywords === null) {
      outobj.keywords = ifUndef(resultset.keyword, 'sep')
    }

    if (!!outobj.loc) {
      outobj.loc = he.decode(outobj.loc);
    }
    if (outobj.altmin > outobj.altmax & !!outobj.altmax & !!outobj.altmin) {
      return res.status(500)
        .json({
          status: 'failure',
          message: 'The altmin is greater than altmax.  Please fix this!'
        });
    } else {

      var goodloc = !!outobj.loc

      if (goodloc) {
        try {
          var newloc = JSON.parse(outobj.loc)
          newloc = WKT.convert(JSON.parse(outobj.loc));
        } catch (err) {
          newloc = outobj.loc;
        }
        outobj.loc = newloc;
      }

      /* Here's the actual call */
      const geopol = 'SELECT geopoliticalid AS output FROM ndb.geopoliticalunits WHERE geopoliticalname ILIKE ANY(${gpid});';
      const taxa = 'SELECT taxonid AS output FROM ndb.taxa WHERE taxonname ILIKE ANY(${taxa})';
      const contacts = 'SELECT contactid AS output FROM ndb.contacts WHERE contactname ILIKE ANY(${contacts});';
      const keyword = 'SELECT keywordid AS output FROM ndb.keywords WHERE keyword ILIKE ANY(${keywords})';

      Promise.all([checkObject(res, geopol, outobj.gpid, outobj),
        checkObject(res, keyword, outobj.keywords, outobj),
        checkObject(res, taxa, outobj.taxa, outobj),
        checkObject(res, contacts, outobj.contacts, outobj)])
        .then(result => {
          outobj.gpid = result[0]
          outobj.keywords = result[1]
          outobj.taxa = result[2]
          outobj.contacts = result[3]
          db.any(siteQuery, outobj)
            .then(function (data) {
              res.status(200)
                .json({
                  status: 'success',
                  data: data,
                  message: 'Retrieved all tables'
                });
            })
            .catch(function (err) {
              return res.status(500)
                .json({
                  status: 'failure',
                  message: err.message,
                  query: outobj
                });
            });
        });
    }
  }
}

function sitesbydataset (req, res, next) {
  var gooddsid = !!req.params.datasetid;

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
  }

  if (Object.keys(resultset).indexOf('datasetid') !== -1) {
    var datasetid = commaSep(resultset.datasetid)
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass either queries or an integer sequence.'
      });
  }

  db.any(sitebydsid, [datasetid])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return res.status(500)
        .json({
          status: 'failure',
          message: err.message,
          query: datasetid
        });
    });
}

function sitesbygeopol (req, res, next) {
  var goodgp = !!req.params.gpid;

  if (goodgp) {
    var gpid = { gpid: commaSep(req.params.gpid) };
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass either queries or an integer sequence.'
      });
  }

  if (!!req.query.limit) {
    gpid.limit = req.query.limit
  } else {
    gpid.limit = 25
  }

  if (!!req.query.offset) {
    gpid.offset = req.query.offset
  } else {
    gpid.offset = 25
  }

  db.any(sitebygpid, gpid)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          query: gpid,
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return res.status(500)
        .json({
          status: 'failure',
          message: err.message,
          query: gpid
        });
    });
}

function sitesbycontact (req, res, next) {
  var goodctc = !!req.params.contactid

  if (goodctc) {
    var contactid = String(req.params.contactid).split(',').map(function (item) {
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

  db.any(sitebyctid, [contactid])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return res.status(500)
        .json({
          status: 'failure',
          message: err.message,
          query: [contactid]
        });
    });
}

module.exports.sitesbyid = sitesbyid;
module.exports.sitesquery = sitesquery;
module.exports.sitesbydataset = sitesbydataset;
module.exports.sitesbygeopol = sitesbygeopol;
module.exports.sitesbycontact = sitesbycontact;
