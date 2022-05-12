// Contacts query:

const path = require('path');

// get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;

const { sql, commaSep, ifUndef, removeEmpty, validateOut } = require('../../../src/neotomaapi.js');

// Create a QueryFile globally, once per file:
const contactbyid = sql('../v2.0/helpers/contacts/contactbyid.sql');
const contactquery = sql('../v2.0/helpers/contacts/contactquery.sql');
const contactbydsid = sql('../v2.0/helpers/contacts/contactbydsid.sql');
const contactbystid = sql('../v2.0/helpers/contacts/contactbysiteid.sql');

function contacts (req, res, next) {
  var contactIdUsed = !!req.query.contactid;
  if (contactIdUsed) {
    var contactid = String(req.query.contactid).split(',').map(function (item) {
      return parseInt(item, 10);
    });
  };

  var outobj = {
    'contactid': contactid,
    'contactname': req.query.contactname,
    'familyname': req.query.familyname,
    'contactstatus': req.query.contactstatus,
    'name': req.query.name,
    'similarity': req.query.similarity,
    'limit': req.query.limit || 25,
    'offset': req.query.offset || 0
  };

  outobj = validateOut(outobj);

  if (Object.keys(outobj).every(function (x) { return typeof outobj[x] === 'undefined'; }) === false) {
    db.any(contactquery, outobj)
      .then(function (data) {
        if (data.length === 0) {
          // We're returning the structure, but nothing inside it:
          var returner = [];
        } else {
          returner = data;
        };

        res.status(200)
          .json({
            status: 'success',
            data: { query: outobj, result: returner }
          });
      })
      .catch(function (err) {
        return next(err);
      });
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
        var returner = [];
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
        var returner = [];
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
        var returner = [];
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
