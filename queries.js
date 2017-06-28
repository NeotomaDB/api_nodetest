var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var ctStr = require("./db_connect.json");

// Connecting to the database:
var db = pgp(ctStr);

// Defining the query functions:

module.exports = {
  geopoliticalunits:geopoliticalunits,
  publications:publications,
  dbtables:dbtables,
  chronology:chronology,
  contacts:contacts,
  occurrence:occurrence,
  pollen:pollen,
  taxa:taxa,
  site:site,
  dataset:dataset,
  download:download
};

/* All the Endpoint functions */

function dbtables(req, res, next) {

  var tableID = req.params.table;

  if (tableID == null) {
    var query = 'SELECT table_name AS table FROM information_schema.tables AS ischeme;';
  } else {
    var query = 'SELECT * FROM "' + tableID + '"';
  }

  db.any(query)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      res.status(500)
        .json({
          status:'error',
          data: err,
          message:'Got an error.'
        });
    });
};


function site(req, res, next) {
  
  // Get the input parameters:
  
  var pubid = req.query.pubid;
  var datasetid = req.query.datasetid;
  var siteid = req.query.siteid;

  // Get the query string:
  var query = 'SELECT * FROM "NDB"."Sites" as sts WHERE ';

  if (!!siteid) {
    query = query + 'sts."SiteID" = '  + siteid;
  }

  db.any(query)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      /*res.status(500)
        .json({
          status:'error',
          data: err,
          message:'Got an error.'
        });*/
        next(err)
    });
}

function taxa(req, res, next) {
  
  // Get the query string:
  var query = {};

  res.status(200)
    .json({
      status: 'success',
      query: query,
      message: 'Retrieved taxa'
      })

}

function pollen(req, res, next) {
  
  // Get the query string:
  var query = {};

  res.status(200)
    .json({
      status: 'success',
      query: query,
      message: 'Retrieved pollen'
      })

}

function occurrence(req, res, next) {
  
  // Get the query string:
  var query = {};

  res.status(200)
    .json({
      status: 'success',
      query: query,
      message: 'Retrieved occurrences'
      })

}


function contacts(req, res, next) {
  
  // Get the query string:
  var query = {};

    db.any('SELECT * FROM "Contacts"')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return next(err);
    });


  res.status(200)
    .json({
      status: 'success',
      query: query,
      message: 'Retrieved contacts'
      })

}


function dataset(req, res, next) {
  
  // Get the query string:
  var pubid = req.query.pubid;
  var datasetid = req.query.datasetid;
  var siteid = req.query.siteid;

  // Get the query string:
  var query = 'SELECT * FROM "Datasets" as dts WHERE ';

  if (!!datasetid) {
    query = query + 'dts."DatasetID" = '  + datasetid;
  }

  db.any(query)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      res.status(500)
        .json({
          status:'error',
          data: err,
          message:'Got an error.'
        });
    });

}

function download(req, res, next) {
  
  // Get the query string:
  var query = {};

  res.status(200)
    .json({
      status: 'success',
      query: query,
      message: 'Retrieved chronology'
      })

}


function chronology(req, res, next) {
  
  // Get the query string:
  var query = {};

  res.status(200)
    .json({
      status: 'success',
      query: query,
      message: 'Retrieved chronology'
      })

}

function publications(req, res, next) {
  
  if (!!req.params.pubid) {
    var pubid = parseInt(req.params.pubid);

    var query = 'select * from "Publications" where "PublicationID" = ' + pubid;
    var outarray = [];

  } else {

    // Get the query string:
    var outobj = {    'pubid':req.query.pubid,
                  'contactid':req.query.contactid,
                  'datasetid':req.query.datasetid,
                     'siteid':req.query.siteid,
                     'author':req.query.author,
                    'pubtype':req.query.pubtype,
                       'year':req.query.year,
                     'search':req.query.search
             };

    var outarray = [];

    // Clean out undefined values, turning them to null

    for(var key in outobj) {
      if(outobj[key] === undefined) {
        outarray.push(null);
      } else {
        outarray.push(outobj[key]);
      }
    };

    var query = 'SELECT * FROM "Publications" AS pubs  ' +
                'WHERE                                 ' +
                '(${pubid} IS NULL OR "PublicationID" = ${pubid})  ' +
                'AND (${contactid} IS NULL OR "PublicationID" IN ' +
                '    (SELECT "PublicationID" FROM "PublicationAuthors" ' +
                '     WHERE "ContactID" = ${contactid})' +
                '    )' +
                'AND (${datasetid} IS NULL OR "PublicationID" IN ' +
                    '(SELECT "PublicationID" FROM "DatasetPublications" ' +
                    ' WHERE "DatasetID" = ${datasetid}) ' +
                    ') ' +
                'AND (${siteid} IS NULL OR "PublicationID" IN ' +
                    '(SELECT "PublicationID" FROM "DatasetPublications" as dpub ' +
                     'INNER JOIN ' +
                     '"Datasets" as ds ON ds."DatasetID" = dpub."DatasetID" ' +
                     'INNER JOIN ' +
                     '"CollectionUnits" as cu ON cu."CollectionUnitID" = ds."CollectionUnitID" ' +
                     'WHERE cu."SiteID" = ${siteid}) ' +
                    ')';

  }

  output = db.any(query, outarray)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return next(err);
    });
};


function geopoliticalunits(req, res, next) {

  /*
  Geopolitical units work this way:
    Can pass a string or identifier to figure out names & IDs.
      - Not really sure why this is important. . . 
    Should be able to pass in site IDs, or dataset IDs to then figure out
      where the records are, with regards to political units.
  */ 
  
  if (!!req.params.gpid) {
  
    var gpuID = parseInt(req.params.gpid);

    var query = 'select * from "GeoPoliticalUnits" where "GeoPoliticalID" = ' + gpuID;
    var outobj = [];

  } else {
    
    var outobj = {   'gpid':req.query.gpid,
                   'gpname':req.query.gpname,
                     'rank':req.query.rank,
                    'lower':req.query.lower
                 };

    var query = 'WITH gid AS ' +
                '(SELECT * ' +
                'FROM "GeoPoliticalUnits" AS gpu WHERE ' +
                '(${gpid} IS NULL OR gpu."GeoPoliticalID" = 1) ' +
                'AND (${gpname} IS NULL OR gpu."GeoPoliticalName" LIKE ${gpname}) ' +
                'AND (${rank} IS NULL OR gpu."Rank" = ${rank}))' +
                'SELECT * FROM "GeoPoliticalUnits" AS gpu ' +
                'WHERE gpu."GeoPoliticalID" IN ' +
                '(SELECT "GeoPoliticalID" FROM gid) ' +
                'UNION ' +
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