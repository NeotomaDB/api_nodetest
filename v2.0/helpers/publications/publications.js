// Sites query:

const path = require('path');
const bib = require('../bib_format');

//  get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;
var validate = require('../validateOut').validateOut

// Helper for linking to external query files:
function sql (file) {
  const fullPath = path.join(__dirname, file);
  return new pgp.QueryFile(fullPath, {minify: true});
}

// Create a QueryFile globally, once per file:
const pubbydsid = sql('./pubdsidquery.sql');
const pubbystid = sql('./pubstidquery.sql');
const pubquery = sql('./pubquery.sql');
const rawpub  = sql('./raw_pubid.sql');

function publicationid (req, res, next) {
  var pubIdUsed = !!req.params.pubid;

  if (pubIdUsed) {
    var pubid = {pubid: String(req.params.pubid)
      .split(',')
      .map(function (item) {
        return parseInt(item, 10);
      })};
  }

  db.any(rawpub, pubid)
    .then(function (data) {
      var bibOutput = bib.formatpublbib(data);

      res.status(200)
        .json({
          status: 'success',
          data: bibOutput,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return next(err);
    });
};

function publicationquery (req, res, next) {
  var outobj = {
    'pubid': String(req.query.pubid)
      .split(',')
      .map(function (item) {
        return parseInt(item, 10);
      }),
    'datasetid': String(req.query.datasetid)
      .split(',')
      .map(function (item) {
        return parseInt(item, 10);
      }),
    'siteid': String(req.query.siteid)
      .split(',')
      .map(function (item) {
        return parseInt(item, 10);
      }),
    'familyname': String(req.query.familyname),
    'pubtype': String(req.query.pubtype),
    'year': parseInt(req.query.year),
    'search': String(req.query.search),
    'limit': parseInt(req.query.limit),
    'offset': parseInt(req.query.offset)
  };

  outobj = validate(outobj);

  var novalues = Object.keys(outobj).every(function (x) {
    return typeof outobj[x] === 'undefined' || !outobj[x];
  });

  if (novalues === true) {
    if (!!req.accepts('json') & !req.accepts('html')) {
      res.redirect('/swagger.json');
    } else {
      res.redirect('/api-docs');
    };
  } else {
    db.any(pubquery, outobj)
      .then(function (data) {
        var returner = bib.formatpublbib(data);

        res.status(200)
          .json({
            status: 'success',
            data: {query: outobj, result: returner}
          });
      })
      .catch(function (err) {
        return next(err);
      });
  };
};

function publicationbysite (req, res, next) {
  var siteIdUsed = !!req.params.siteid;

  if (siteIdUsed) {
    var siteid = String(req.params.siteid).split(',').map(function (item) {
      return parseInt(item, 10);
    });
  } else {
    res.redirect('/api-docs')
  }

  db.any(pubbystid, [siteid])
    .then(function (data) {
      var bibOutput = bib.formatpublbib(data);

      var returner = [];

      for (var i = 0; i < data.length; i++) {
        returner[i] = {siteid: data[i].siteid, publication: bibOutput[0]};
      }

      res.status(200)
        .json({
          status: 'success',
          data: returner,
          message: 'Retrieved all records.'
        });
    })
    .catch(function (err) {
      next(err);
    });
};

function publicationbydataset (req, res, next) {
  /*
  Get publications by associated dataset IDs:
  */
  var dsIdUsed = !!req.params.datasetid;

  if (dsIdUsed) {
    var datasetid = String(req.params.datasetid).split(',').map(function (item) {
      return parseInt(item, 10);
    });
  }

  db.any(pubbydsid, [datasetid])
    .then(function (data) {
      var bibOutput = bib.formatpublbib(data);

      res.status(200)
        .json({
          status: 'success',
          data: bibOutput,
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
module.exports.publicationquery = publicationquery;
