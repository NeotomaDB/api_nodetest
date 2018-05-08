// Sites query:

const path = require('path');

// get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;

// Helper for linking to external query files:
function sql (file) {
  const fullPath = path.join(__dirname, file);
  return new pgp.QueryFile(fullPath, {minify: true});
}

// Create a QueryFile globally, once per file:
const contactbyid = sql('./contactbyid.sql');
const contactquery = sql('./contactquery.sql');
const contactbydsid = sql('./contactbydsid.sql');
const contactbystid = sql('./contactbysiteid.sql');

function contacts (req, res, next) {
  if (!!req.query.contactid) {
    var contactid = String(req.query.contactid).split(',').map(function(item) {
      return parseInt(item, 10);
    });
  };

  var outobj = {'lastname': req.query.lastname,
    'contactname': req.query.contactname,
    'status': req.query.status,
    'contactid': contactid,
    'limit': req.query.limit,
    'offset': req.query.offset
  };

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
    if (Object.keys(outobj).every(function (x) { return typeof outobj[x] === 'undefined'; }) === false) {
      db.any(contactquery, outobj)
        .then(function (data) {
          if (data.length === 0) {
            // We're returning the structure, but nothing inside it:
            var returner = [{'contactid': null,
              'contactname': null,
              'familyname': null,
              'givennames': null,
              'status': null,
              'url': null,
              'address': null}]
          } else {
            returner = data;
          }

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
}

function contactsbyid (req, res, next) {
  if (!!req.params.contactid) {
    var contactid = String(req.params.contactid).split(',').map(function(item) {
      return parseInt(item, 10);
    });
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass either queries or an integer sequence.'
      });
  }

  db.any(contactbyid, [contactid])
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

function contactsbydataid (req, res, next) {
  if (!!req.params.datasetid) {
    var datasetid = String(req.params.datasetid).split(',').map(function(item) {
      return parseInt(item, 10);
    });
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass either queries or an integer sequence.'
      });
  }

  db.any(contactbydsid, [datasetid])
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
    })
}

function contactsbysiteid (req, res, next) {
  if (!!req.params.siteid) {
    var siteid = String(req.params.siteid).split(',').map(function(item) {
      return parseInt(item, 10);
    });
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass either queries or an integer sequence.'
      });
  }

  db.any(contactbystid, [siteid])
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
    })
}

module.exports.contactquery = contacts;
module.exports.contactsbyid = contactsbyid;
module.exports.contactsbydataid = contactsbydataid;
module.exports.contactsbysiteid = contactsbysiteid;
