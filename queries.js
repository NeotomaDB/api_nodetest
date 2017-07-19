var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var ctStr = require("./db_connect.json");
const bib   = require('./helpers/bib_format');

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
  taxonid:gettaxa,
  taxonquery:gettaxonquery,
  sites:sites
};

/* All the Endpoint functions */

function dbtables(req, res, next) {

  var tableID = req.params.table;

  if (tableID == null) {
    var query = "SELECT tablename FROM pg_tables WHERE schemaname='ndb';";
  } else {
    var query = 'SELECT * FROM ndb.' + tableID + ';'
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


function sites(req, res, next) {
  
  // Get the input parameters:

  // Get the query string:
  var query = 'SELECT * FROM ndb.sites as sts WHERE ';

  if (!!req.params.siteid) {
    query = query + 'sts.siteid = '  + req.params.siteid + ';';
  } else {
    var pubid = req.query.pubid;
    var datasetid = req.query.datasetid;
    var siteid = req.query.siteid;
  }

  console.log(query);

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
        return next(err);
    });
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
  
  var query = 'select * from ndb.publications AS pubs where pubs.publicationid = ' + pubid;
  


  output = db.any(query)
    .then(function (data) {
      bib_output = bib.formatpublbib(data);

      res.status(200)
        .json({
          status: 'success',
          data: bib_output,
          message: 'Retrieved all tables'
        });    })
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
  Get publications by associated dataset IDs:
  */

  if (!!req.params.datasetid) {
  
    var datasetid = String(req.params.datasetid).split(',').map(function(item) {
      return parseInt(item, 10);
    });

    query = 'WITH dpub AS '+
            '(SELECT * FROM ndb.datasetpublications as dp ' +
            'WHERE ($1 IS NULL OR dp.datasetid IN ($1:csv))) ' +
            'SELECT * FROM ndb.publications AS pub INNER JOIN ' +
            'ndb.publicationauthors AS pa ON pub.publicationid = pa.publicationid INNER JOIN ' +
            'ndb.contacts as ca ON ca.contactid = pa.contactid ' +
            'WHERE pub.publicationid IN (SELECT publicationid FROM dpub)'

  }
  
  output = db.any(query, [datasetid])
    .then(function (data) {
      bib_output = bib.formatpublbib(data);

      res.status(200)
        .json({
          status: 'success',
          data: bib_output,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      next(err);
    });
}

function gettaxa(req, res, next) {
  
  var taxonid = String(req.params.taxonid).split(',').map(function(item) {
    return parseInt(item, 10);
  });

  // Get the query string:
    // Get the query string:
  var query = 'SELECT * FROM ndb.taxa WHERE ';

  if (!!taxonid) {
    query = query + 'taxa.taxonid IN ($1:csv)';
  }

  console.log(query);

  db.any(query, [taxonid])
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
}

function gettaxonquery(req, res, next) {

  var outobj = {'taxonid':req.query.taxonid,
                   'name':req.query.name,
              'ecolgroup':req.query.ecolgroup,
                  'lower':req.query.lower
               };

  var query = 'WITH taxid AS ' +
              '(SELECT * FROM ndb.taxa AS taxa WHERE ' +
              '(${taxonid} IS NULL OR taxa.taxonid = ${taxonid}) ' +
              'AND (${name} IS NULL OR taxa.taxonname LIKE ${name}) ' +
              'AND (${ecolgroup} IS NULL OR taxa.taxagroupid = ${ecolgroup})) ' +
              'SELECT * FROM taxid ' +
              'UNION ' +
              'SELECT * FROM ndb.taxa AS taxa ' +
              'WHERE (${lower} IS true AND taxa.highertaxonid IN ' +
              '(SELECT taxonid FROM taxid))';

  db.any(query, outobj)
    .then(function (data) {
      console.log(outobj.taxonid);

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
}
