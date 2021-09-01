// geopoliticalunits query:

const path = require('path');

// get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;

const { sql, commaSep, ifUndef, removeEmpty, validateOut } = require('../../../src/neotomaapi.js');

// Create a QueryFile globally, once per file:
const gpuQuery = sql('../v2.0/helpers/geopoliticalunits/gpuQuery.sql');
const gpuid = sql('../v2.0/helpers/geopoliticalunits/gpubyid.sql');
const gpsiteid = sql('../v2.0/helpers/geopoliticalunits/geopolbysiteid.sql');

function geopoliticalbyid (req, res, next) {
  var gpIdUsed = !!req.params.gpid;

  if (gpIdUsed) {
    var gpid = commaSep(req.params.gpid);
    });
  } else {
    res.status(500)
      .json({
        status: 'failure',
        message: 'Must provide a valid integer GeoPolitical Unit value for the endpoint.'
      });
  };

  db.any(gpuid, [gpid])
    .then(function (data) {
      if (data.length === 0) {
        // We're returning the structure, but nothing inside it:
        var returner = [{ 'geopoliticalid': null,
          'highergeopoliticalid': null,
          'rank': null,
          'geopoliticalunit': null,
          'geopoliticalname': null,
          'higher': null,
          'lower': null,
          'recdatecreated': null,
          'recdatemodified': null }]
      } else {
        returner = data.sort(function (obj1, obj2) {
          return obj1.Rank - obj2.Rank;
        });
      }
      res.status(200)
        .json({
          status: 'success',
          data: returner
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function geopoliticalunits (req, res, next) {
  /*
  Geopolitical units work this way:
    Can pass a string or identifier to figure out names & IDs.
      - Not really sure why this is important. . .
    Should be able to pass in site IDs, or dataset IDs to then figure out
      where the records are, with regards to political units.
  */

  var outobj = { 'gpid': req.query.gpid,
    'gpname': req.query.gpname,
    'rank': req.query.rank,
    'lower': req.query.lower,
    'limit': req.query.limit,
    'offset': req.query.offset
  };

  if (Object.keys(outobj).every(function (x) { return typeof outobj[x] === 'undefined'; }) === false) {
    db.any(gpuQuery, outobj)
      .then(function (data) {
        if (data.length === 0) {
          // We're returning the structure, but nothing inside it:
          var returner = [{ 'geopoliticalid': null,
            'highergeopoliticalid': null,
            'rank': null,
            'geopoliticalunit': null,
            'geopoliticalname': null,
            'higher': null,
            'lower': null,
            'recdatecreated': null,
            'recdatemodified': null }]
        } else {
          returner = data.sort(function (obj1, obj2) {
            return obj1.Rank - obj2.Rank;
          });
        }

        res.status(200)
          .json({
            status: 'success',
            data: { query: outobj, result: returner }
          });
      })
      .catch(function (err) {
        return next(err);
      });
  } else {
    res.redirect('/api-docs');
  }
}

function geopolbysite (req, res, next) {
  /*
  Get geopolitical units by associated site IDs:
  */

  if (req.params.siteid) {
    var siteid = commaSep(req.params.siteid);
    });
    var outobj = { siteid: siteid }

    if (req.query.limit) { 
      outobj.limit = req.query.limit;
    } else {
      outobj.limit = 25;
    }
    if (req.query.offset) {
      outobj.offset = req.query.offset
    } else {
      outobj.offset = 0;
    }

    db.any(gpsiteid, outobj)
      .then(function (data) {
        var returner = data.sort(function (obj1, obj2) {
          return obj1.Rank - obj2.Rank;
        });

        res.status(200)
          .json({
            status: 'success',
            query: outobj,
            data: returner
          });
      })
      .catch(function (err) {
        return next(err);
      });
  } else {
    res.redirect('/api-docs');
  }
}

module.exports.geopolbysite = geopolbysite;
module.exports.geopoliticalunits = geopoliticalunits;
module.exports.geopoliticalbyid = geopoliticalbyid;
