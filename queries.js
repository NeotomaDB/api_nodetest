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
  chronology:chronology,
  contacts:contacts,
  dataset:dataset,
  dbtables:dbtables,
  download:download,
  geopoliticalunits:geopoliticalunits,
  geopolbysite:geopolbysite,
  occurrence:occurrence,
  pollen:pollen,
  publicationid:publicationid,
  publicationquery:publicationquery,
  publicationbydataset:publicationbydataset,
  publicationbysite:publicationbysite,
  taxa:taxa,
  site:site
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
      next(err);
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
        return next(err);
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
      next(err);
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

function publicationid(req, res, next) {
  
  if (!!req.params.pubid) {
    var pubid = parseInt(req.params.pubid);
  } else {
    var pubid = null;
  }
  
  var query = 'select * from "Publications" where "PublicationID" = ' + pubid;
  
  output = db.any(query, pubid)
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

function publicationquery(req, res, next) {
  
};

function publicationbysite(req, res, next) {

}

function publicationbydataset(req, res, next) {

  /*
  Get geopolitical units by associated site IDs:
  */


  if (!!req.params.datasetid) {
  
    var datasetid = String(req.params.datasetid).split(',').map(function(item) {
      return parseInt(item, 10);
    });

    query = 'WITH dpub AS '+
            '(SELECT * FROM "DatasetPublications" as dp ' +
            'WHERE ($1 IS NULL OR dp."DatasetID" IN ($1:csv))) ' +
            'SELECT * FROM "Publications" AS pub ' +
            'WHERE pub."PublicationID" IN (SELECT "PublicationID" FROM dpub)'

  }
  
  console.log(datasetid);

  output = db.any(query, [datasetid])
    .then(function (data) {

      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      next(err);
    });
}
