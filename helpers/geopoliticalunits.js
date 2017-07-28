// geopoliticalunits query:

var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var ctStr = require("../db_connect.json");
const bib   = require('./bib_format');

// Connecting to the database:
var db = pgp(ctStr);

function geopoliticalunits(req, res, next) {

  /*
  Geopolitical units work this way:
    Can pass a string or identifier to figure out names & IDs.
      - Not really sure why this is important. . . 
    Should be able to pass in site IDs, or dataset IDs to then figure out
      where the records are, with regards to political units.
  */ 
  
  if (!!req.params.gpid) {
  
    var gpid = parseInt(req.params.gpid);

    var query = 'select * from "GeoPoliticalUnits" where "GeoPoliticalID" = ${gpid}';
    var outobj = {'gpid':gpid};

  } else {
    
    var outobj = {   'gpid':req.query.gpid,
                   'gpname':req.query.gpname,
                     'rank':req.query.rank,
                    'lower':req.query.lower
                 };

    var query = 'WITH gid AS ' +
                '(SELECT * ' +
                'FROM "GeoPoliticalUnits" AS gpu WHERE ' +
                '(${gpid} IS NULL OR gpu."GeoPoliticalID" = ${gpid}) ' +
                'AND (${gpname} IS NULL OR gpu."GeoPoliticalName" LIKE ${gpname}) ' +
                'AND (${rank} IS NULL OR gpu."Rank" = ${rank}))' +
                'SELECT * FROM "GeoPoliticalUnits" AS gpu ' +
                'WHERE gpu."GeoPoliticalID" IN ' +
                '(SELECT "GeoPoliticalID" FROM gid) ' +
                'UNION ALL ' +
                'SELECT * FROM "GeoPoliticalUnits" AS gpu ' +
                'WHERE (${lower} IS true AND gpu."HigherGeoPoliticalID" IN ' +
                '(SELECT "GeoPoliticalID" FROM gid))';
  }

  db.any(query, outobj)
    .then(function (data) {

      if(data.length == 0) {
        // We're returning the structure, but nothing inside it:
        returner = [{"GeoPoliticalID": null,
                     "HigherGeoPoliticalID": null,
                     "Rank": null,
                     "GeoPoliticalUnit": null,
                     "GeoPoliticalName": null,
                     "Higher": null,
                     "Lower": null,
                     "RecDateCreated": null,
                     "RecDateModified": null}]
      } else {
        returner = data.sort(function(obj1, obj2) {
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


function geopolbysite(req, res, next) {

  /*
  Get geopolitical units by associated site IDs:
  */

  if (!!req.params.siteid) {
  
    var siteid = String(req.params.siteid).split(',').map(function(item) {
      return parseInt(item, 10);
    });

    console.log(siteid);

  }

  res.status(200)
  .json({
    status: 'success',
    data: siteid
  });
}
