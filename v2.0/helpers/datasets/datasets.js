// get global database object
const he = require('he')
const db = require('../../../database/pgp_db');

const { sql, ifUndef, checkObject, getparam } = require('../../../src/neotomaapi.js');

var Terraformer = require('terraformer');
var WKT = require('terraformer-wkt-parser');

const datasetquerysql = sql('../v2.0/helpers/datasets/datasetqueryfaster.sql');
const datasetbyidsql = sql('../v2.0/helpers/datasets/datasetbyid.sql');
const datasetbydbsql = sql('../v2.0/helpers/datasets/datasetbydb.sql');
const datasetbysite = sql('../v2.0/helpers/datasets/datasetbysite.sql');
const datasetbygpidsql = sql('../v2.0/helpers/datasets/datasetbygpid.sql');

function datasetsbygeopol (req, res, next) {
  var gpIdUsed = !!req.params.gpid;

  if (gpIdUsed) {
    var gpData = { 'gpid': String(req.params.gpid)
      .split(',')
      .map(function (item) {
        return parseInt(item, 10);
      }),
    'limit': parseInt(req.query.limit || 25),
    'offset': parseInt(req.query.offset || 0)
    }
    gpData = validateOut(gpData)
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass either queries or a comma separated integer sequence.'
      });
  }
  /*if (gpIdUsed) {
    var gpid = String(req.params.gpid)
      .split(',')
      .map(function (item) {
        return parseInt(item, 10);
      });
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass either queries or a comma separated integer sequence.'
      });
  }
*/
  db.any(datasetbygpidsql, gpData)
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
          message: 'Retrieved results'
        });
    })
    .catch(function (err) {
      res.status(500)
        .json({
          status: 'failure',
          data: err.message,
          message: 'Error in passing query.'
        });
    });
}

function datasetbyid (req, res, next) {
  var dsIdUsed = !!req.params.datasetid;

  if (dsIdUsed) {
    var datasetid = String(req.params.datasetid)
      .split(',')
      .map(function (item) {
        return parseInt(item, 10);
      });
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass either queries or a comma separated integer sequence.'
      });
  }

  db.any(datasetbyidsql, [datasetid])
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
      res.status(500)
        .json({
          status: 'failure',
          data: err.message,
          message: 'Must pass either queries or a comma separated integer sequence.'
        });
      next(err)
    });
}

function datasetbydb (req, res, next) {
  var dbUsed = !!req.query.database;

  if (dbUsed) {
    var database = { 'database': req.query.database,
      'limit': parseInt(req.query.limit || 25),
      'offset': parseInt(req.query.offset || 0)
    }
    database = validateOut(database)
  } else {
    var database = { 'database': '',
      'limit': parseInt(req.query.limit || 25),
      'offset': parseInt(req.query.offset || 0)
    }
    database = validateOut(database)
  }
  
  db.any(datasetbydbsql, database)
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
      res.status(500)
        .json({
          status: 'failure',
          data: err.message,
          message: 'Must pass either queries or a comma separated integer sequence.'
        });
      next(err)
    });
}

function datasetbysiteid (req, res, next) {
  var stIdUsed = !!req.params.siteid;

  if (stIdUsed) {
    var siteid = String(req.params.siteid).split(',').map(function (item) {
      return parseInt(item, 10);
    });
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass an integer sequence.'
      });
  }

  db.any(datasetbysite, [siteid])
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
      res.status(500)
        .json({
          status: 'failure',
          data: err.message,
          message: 'Must pass either queries or a comma separated integer sequence.'
        });
      next(err)
    });
}

function datasetquery (req, res, next) {
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

    // Get the input parameters:
    var outobj = {
      'datasetid': ifUndef(resultset.datasetid, 'sep'),
      'database': ifUndef(resultset.database, 'sep'),
      'siteid': ifUndef(resultset.siteid, 'sep'),
      'sitename': ifUndef(resultset.sitename, 'sep'),
      'keywords': ifUndef(resultset.keywords, 'sep'),
      'contacts': ifUndef(resultset.keywords, 'sep'),
      'taxa': ifUndef(resultset.taxa, 'sep'),
      'doi': ifUndef(resultset.doi, 'sep'),
      'piid': ifUndef(resultset.piid, 'sep'),
      'datasettype': ifUndef(resultset.datasettype, 'string'),
      'altmin': ifUndef(resultset.altmin, 'int'),
      'altmax': ifUndef(resultset.altmax, 'int'),
      'loc': ifUndef(resultset.loc, 'string'),
      'gpid': ifUndef(resultset.gpid, 'sep'),
      'taxonid': ifUndef(resultset.taxonid, 'sep'),
      'ageyoung': ifUndef(resultset.ageyoung, 'int'),
      'ageold': ifUndef(resultset.ageold, 'int'),
      'ageof': ifUndef(resultset.ageof, 'int'),
      'limit': parseInt(resultset.limit || 25),
      'offset': parseInt(resultset.offset || 0)
    };
    console.log(outobj)
    if (outobj.loc !== null) {
      outobj.loc = he.decode(outobj.loc)
    }

    if (outobj.datasetid !== null) {
      if (outobj.datasetid[0] === 'db') {
        outobj.datasetid = null;
      }
    }

    if (outobj.altmin > outobj.altmax & !!outobj.altmax & !!outobj.altmin) {
      res.status(500)
        .json({
          status: 'failure',
          title: 'Oh man.',
          message: 'The altmin is greater than altmax.  Please fix this!'
        });
    } else if (outobj.ageyoung > outobj.ageold & !!outobj.ageold & !!outobj.ageyoung) {
      res.status(500)
        .json({
          status: 'failure',
          message: 'The older age is smaller than the younger age.  Neotoma ages are assumed to be in calibrated radiocarbon years since 1950, decreasing to the present and increasing through the Pleistocene.'
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
          db.any(datasetquerysql, outobj)
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

module.exports.datasetbyid = datasetbyid;
module.exports.datasetbysiteid = datasetbysiteid;
module.exports.datasetquery = datasetquery;
module.exports.datasetbydb = datasetbydb;
module.exports.datasetsbygeopol = datasetsbygeopol;
