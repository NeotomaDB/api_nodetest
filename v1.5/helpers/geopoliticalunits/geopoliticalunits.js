const { sql } = require('../../../src/neotomaapi.js');

// Create a QueryFile globally, once per file:
// const gpuQuery = sql('../v1.5/helpers/geopoliticalunts/gpuQuery.sql');
const gpuid = sql('../v1.5/helpers/geopoliticalunits/gpubyid.sql');

function geopoliticalbyid(req, res, next) {
  let db = req.app.locals.db
  if (!!req.params.gpid) {
    var gpid = String(req.params.gpid).split(',').map(function(item) {
      return parseInt(item, 10);
    });
  } else {
    res.status(200)
      .json({
        success: 1,
        status: 'success',
        data: returner
      });
  };

  db.any(gpuid, [gpid])
    .then(function (data) {
      if (data.length == 0) {
        // We're returning the structure, but nothing inside it:
        returner = [{"geopoliticalid": null,
          "highergeopoliticalid": null,
          "rank": null,
          "geopoliticalunit": null,
          "geopoliticalname": null,
          "higher": null,
          "lower": null,
          "recdatecreated": null,
          "recdatemodified": null}]
      } else {
        var returner = data.sort(function(obj1, obj2) {
          return obj1.Rank - obj2.Rank;
        });
      }
      res.status(200)
        .json({
          success: 1,
          status: 'success',
          data: returner
        });
    })
    .catch(function (err) {
      return next(err);
    })
}

function geopoliticalunits(req, res, next) {
  let db = req.app.locals.db
  /*
  Geopolitical units work this way:
    Can pass a string or identifier to figure out names & IDs.
      - Not really sure why this is important. . .
    Should be able to pass in site IDs, or dataset IDs to then figure out
      where the records are, with regards to political units.
  */


  var querySQL, gpID;
  //no id passed, return top level geopoliticalunits
  if(!req.query.hasOwnProperty("id")) {
    querySQL = "select geopoliticalid, geopoliticalname from da.geopoliticalunits where rank = 1";
  } else {
    gpID = String(req.query.id).split(',').map(function(item) {
      return parseInt(item, 10);
    });
    if(!isNaN(gpID[0])) {
      querySQL = "select geopoliticalid, geopoliticalname from da.geopoliticalunits where highergeopoliticalid = " + gpID;
    } else {
      querySQL = "select geopoliticalid, geopoliticalname from da.geopoliticalunits"
    }
  }

  db.any(querySQL, gpID)
    .then(function (data) {
      res.status(200)
        .jsonp({
          success: 1,
          status: 'success',
          data: data
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports.geopoliticalunits = geopoliticalunits;
module.exports.geopoliticalbyid = geopoliticalbyid;
