// geopoliticalunits query:

const path = require('path');

//get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;

const bib   = require('./../bib_format');

// Helper for linking to external query files:
function sql(file) {
    const fullPath = path.join(__dirname, file);
    return new pgp.QueryFile(fullPath, {minify: true});
}

// Create a QueryFile globally, once per file:
const gpuQuery = sql('./gpuQuery.sql');
const gpuid = sql('./gpubyid.sql');

function geopoliticalbyid(req, res, next) {

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

  console.log(gpid);

  db.any(gpuid, [gpid])
    .then(function (data) {

      if(data.length == 0) {
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
        returner = data.sort(function(obj1, obj2) {
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
    });

}

function geopoliticalunits(req, res, next) {

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
    querySQL = "select geopoliticalid, geopoliticalname from da.geopoliticalunits where highergeopoliticalid = " + gpID;
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


// function geopolbysite(req, res, next) {

//   /*
//   Get geopolitical units by associated site IDs:
//   */

//   if (!!req.params.siteid) {
  
//     var siteid = String(req.params.siteid).split(',').map(function(item) {
//       return parseInt(item, 10);
//     });

//     console.log(siteid);

//   }

//   res.status(200)
//   .json({
//     status: 'success',
//     data: siteid
//   });
// }

// module.exports.geopolbysite = geopolbysite;

module.exports.geopoliticalunits = geopoliticalunits;
module.exports.geopoliticalbyid = geopoliticalbyid;