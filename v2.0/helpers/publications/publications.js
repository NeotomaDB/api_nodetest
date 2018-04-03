// Sites query:

const path = require('path');
const bib   = require('../bib_format');

//get global database object
var db = require('../../database/pgp_db');
var pgp = db.$config.pgp;

// Helper for linking to external query files:
function sql(file) {
    const fullPath = path.join(__dirname, file);
    return new pgp.QueryFile(fullPath, {minify: true});
}

// Create a QueryFile globally, once per file:
const pubbydsid = sql('./pubdsidquery.sql');
const pubbystid = sql('./pubstidquery.sql');

function publicationid(req, res, next) {
  
  if (!!req.params.pubid) {
    var pubid = parseInt(req.params.pubid);
  } else {
    var pubid = null;
  }
  
  var query = 'select * from ndb.publications AS pubs where pubs.publicationid = ' + pubid;

  db.any(query)
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
  if (!!req.params.siteid) {
  
    var siteid = String(req.params.siteid).split(',').map(function(item) {
      return parseInt(item, 10);
    });

  }
  
  db.any(pubbystid, [siteid])
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

};

function publicationbydataset(req, res, next) {

  /*
  Get publications by associated dataset IDs:
  */

  if (!!req.params.datasetid) {
  
    var datasetid = String(req.params.datasetid).split(',').map(function(item) {
      return parseInt(item, 10);
    });


  }
  
  db.any(pubbydsid, [datasetid])
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

module.exports.publicationbydataset = publicationbydataset;
module.exports.publicationbysite = publicationbysite;
module.exports.publicationid = publicationid;