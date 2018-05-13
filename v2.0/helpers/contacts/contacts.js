// Sites query:

const path = require('path');

// get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;
var validate = require('../validateOut').validateOut;

// Create a QueryFile globally, once per file:
const contactbyid = sql('./contactbyid.sql');
const contactquery = sql('./contactquery.sql');
const contactbydsid = sql('./contactbydsid.sql');
const contactbystid = sql('./contactbysiteid.sql');

var emptyReturn = [{'contactid': null,
  'fullName': null,
  'lastName': null,
  'firstNames': null,
  'contactStatus': null,
  'url': null,
  'address': null}]

// Helper for linking to external query files:
function sql (file) {
  const fullPath = path.join(__dirname, file);
  return new pgp.QueryFile(fullPath, {minify: true});
}

function contacts (req, res, next) {
  var contactIdUsed = !!req.query.contactid;
  if (contactIdUsed) {
    var contactid = String(req.query.contactid).split(',').map(function (item) {
      return parseInt(item, 10);
    });
  };

  var outobj = {'contactid': contactid,
    'contactname': req.query.contactname,
    'lastname': req.query.lastname,
    'status': req.query.status,
    'limit': req.query.limit,
    'offset': req.query.offset
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
    if (Object.keys(outobj).every(function (x) { return typeof outobj[x] === 'undefined'; }) === false) {
      db.any(contactquery, outobj)
        .then(function (data) {
          if (data.length === 0) {
            // We're returning the structure, but nothing inside it:
            var returner = emptyReturn;
          } else {
            returner = data;
          };

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
  var contactUsed = !!req.params.contactid

  if (contactUsed) {
    var contactid = String(req.params.contactid).split(',').map(function (item) {
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
      if (data.length === 0) {
        // We're returning the structure, but nothing inside it:
        var returner = emptyReturn;
      } else {
        returner = data;
      };

      res.status(200)
        .json({
          status: 'success',
          data: returner,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function contactsbydataid (req, res, next) {
  var datasetIdUsed = !!req.params.datasetid

  if (datasetIdUsed) {
    var datasetid = String(req.params.datasetid).split(',').map(function (item) {
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
      if (data.length === 0) {
        // We're returning the structure, but nothing inside it:
        var returner = emptyReturn;
      } else {
        returner = data;
      };

      res.status(200)
        .json({
          status: 'success',
          data: returner,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return next(err);
    })
}

function contactsbysiteid (req, res, next) {
  var siteIdUsed = !!req.params.siteid;
  if (siteIdUsed) {
    var siteid = String(req.params.siteid).split(',').map(function (item) {
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
      if (data.length === 0) {
        // We're returning the structure, but nothing inside it:
        var returner = emptyReturn;
      } else {
        returner = data;
      };

      res.status(200)
        .json({
          status: 'success',
          data: returner,
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
