// Contacts query:
'use strict';
const {sql, validateOut} = require('../../../src/neotomaapi.js');

// Create a QueryFile globally, once per file:
const contactbyid = sql('../v2.0/helpers/contacts/contactbyid.sql');
const contactquery = sql('../v2.0/helpers/contacts/contactquery.sql');
const contactbydsid = sql('../v2.0/helpers/contacts/contactbydsid.sql');
const contactbystid = sql('../v2.0/helpers/contacts/contactbysiteid.sql');

/**
 * General call to obtain contact information from the Neotoma Database.
 * @param {req} req An express.js `requests` object.
 * @param {res} res An express.js `response` object.
 * @param {next} next An express.js `next` object.
 */
function contacts(req, res, next) {
  const db = req.app.locals.db;
  const contactIdUsed = !!req.query.contactid;
  let contactid;

  if (contactIdUsed) {
    contactid = String(req.query.contactid).split(',').map(function(item) {
      return parseInt(item, 10);
    });
  };

  let outobj = {
    'contactid': contactid,
    'contactname': req.query.contactname,
    'familyname': req.query.familyname,
    'contactstatus': req.query.contactstatus,
    'name': req.query.name,
    'similarity': req.query.similarity,
    'limit': req.query.limit || 25,
    'offset': req.query.offset || 0,
  };

  outobj = validateOut(outobj);

  if (Object.keys(outobj).every(function(x) {return typeof outobj[x] === 'undefined';}) === false) {
    db.any(contactquery, outobj)
        .then(function(data) {
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
              });
        })
        .catch(function(err) {
          res.status(500)
              .json({
                status: 'failure',
                data: err.message,
              });
        });
  };
}

/**
 * Specific call to obtain contact information from the Neotoma Database
 * using a contact ID.
 * @param {req} req An express.js `requests` object.
 * @param {res} res An express.js `response` object.
 * @param {next} next An express.js `next` object.
 */
function contactsbyid(req, res, next) {
  const db = req.app.locals.db;
  const contactUsed = !!req.params.contactid;
  let contactid;

  if (contactUsed) {
    contactid = String(req.params.contactid).split(',').map(function(item) {
      return parseInt(item, 10);
    });
  } else {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: 'Must pass either queries or an integer sequence.',
        });
  }

  db.any(contactbyid, [contactid])
      .then(function(data) {
        let returner = [];
        if (data.length !== 0) {
          returner = data;
        };

        res.status(200)
            .json({
              status: 'success',
              data: returner,
              message: 'Retrieved all tables',
            });
      })
      .catch(function(err) {
        res.status(500)
            .json({
              status: 'failure',
              data: err.message,
            });
      });
}

/**
 * Specific call to obtain contact information from the Neotoma Database
 * using a dataset ID.
 * @param {req} req An express.js `requests` object.
 * @param {res} res An express.js `response` object.
 * @param {next} next An express.js `next` object.
 */
function contactsbydataid(req, res, next) {
  const db = req.app.locals.db;
  const datasetIdUsed = !!req.params.datasetid;
  let datasetid;
  if (datasetIdUsed) {
    datasetid = String(req.params.datasetid).split(',').map(function(item) {
      return parseInt(item, 10);
    });
  } else {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: 'Must pass either queries or an integer sequence.',
        });
  }

  db.any(contactbydsid, [datasetid])
      .then(function(data) {
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
              message: 'Retrieved all tables',
            });
      })
      .catch(function(err) {
        res.status(500)
            .json({
              status: 'failure',
              data: err.message,
            });
      });
}

function contactclassbydsid(req, res, next) {
  const contactclassbydsid = sql('../v2.0/helpers/contacts/contact_class.sql');
  const db = req.app.locals.db;
  const datasetIdUsed = !!req.params.datasetid;
  if (datasetIdUsed) {
    var datasetid = parseInt(req.params.datasetid);
  } else {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: 'Must pass either queries or an integer sequence.',
        });
  }
  db.any(contactclassbydsid, [datasetid])
      .then(function(data) {
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
              message: 'Retrieved all tables',
            });
      })
      .catch(function(err) {
        res.status(500)
            .json({
              status: 'failure',
              data: err.message,
            });
      });
}

function contactsbysiteid(req, res, next) {
  const db = req.app.locals.db;
  const siteIdUsed = !!req.params.siteid;
  if (siteIdUsed) {
    var siteid = String(req.params.siteid).split(',').map(function(item) {
      return parseInt(item, 10);
    });
  } else {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: 'Must pass either queries or an integer sequence.',
        });
  }
  db.any(contactbystid, [siteid])
      .then(function(data) {
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
              message: 'Retrieved all tables',
            });
      })
      .catch(function(err) {
        res.status(500)
            .json({
              status: 'failure',
              data: err.message,
            });
      });
}

module.exports.contactquery = contacts;
module.exports.contactsbyid = contactsbyid;
module.exports.contactsbydataid = contactsbydataid;
module.exports.contactsbysiteid = contactsbysiteid;
module.exports.contactclassbydsid = contactclassbydsid;
