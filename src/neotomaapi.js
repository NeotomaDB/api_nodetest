const path = require('path');
var db = require('../database/pgp_db');
var pgp = db.$config.pgp;

// Goes through an object tree and clears out NULL elements (not sure this is the best).
function removeEmpty (obj) {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key]);
    else if (obj[key] == null) delete obj[key];
  });
};

// Helper for linking to external query files:
function sql (file) {
  const fullPath = path.join(__dirname, file);
  return new pgp.QueryFile(fullPath, {
    minify: true
  });
}

/**
   * Parser for comma separated strings.
   * @param x A comma separated string.
   * @return An array of integers.
   */
function commaSep (x) {
  return String(x).split(',').map(function (item) {
    return parseInt(item, 10);
  });
}

/**
   * Quickly return value or null.
   * @param x Any value passed in from an object.
   * @return either the value of `x` or a `null` value.
   */
function ifUndef (x, opr) {
  if (typeof x === 'undefined') {
    return null;
  } else {
    switch (opr) {
      case 'string':
        return String(x);
      case 'sep':
        return commaSep(x);
      case 'int':
        return parseInt(x, 10);
    }
  }
}

//  To validate objects that are going to be passed from a param/query to a DB call.
function validateOut (outobj) {
  var keyLength = Object.keys(outobj).length - 1;

  for (var i = keyLength; i > -1; i--) {
    // Check for undefined values
    if (typeof outobj[Object.keys(outobj)[i]] === 'undefined' |
        outobj[Object.keys(outobj)[i]] === 'undefined') {
      outobj[Object.keys(outobj)[i]] = null;
    }
    // Check for stand-alone null values.
    if (typeof outobj[Object.keys(outobj)[i]] === 'number' & isNaN(outobj[Object.keys(outobj)[i]])) {
      outobj[Object.keys(outobj)[i]] = null;
    }

    // Check to see if the array is just an array of NaN:
    if (Array.isArray(outobj[Object.keys(outobj)[i]])) {
      if (outobj[Object.keys(outobj)[i]][0] !== outobj[Object.keys(outobj)[i]][0]) {
        outobj[Object.keys(outobj)[i]] = null;
      }
    }
  }

  return outobj;
}

function failure (query, msg) {
  let failobj = { 'status': 0,
    'data': null,
    'query': query,
    'message': msg }
  return failobj;
}

function success (query, data, msg) {
  let success = { 'status': 1,
    'data': data,
    'query': query,
    'message': msg }
  return success;
}

module.exports.failure = failure;
module.exports.success = success;
module.exports.validateOut = validateOut;
module.exports.sql = sql;
module.exports.ifUndef = ifUndef;
module.exports.commaSep = commaSep;
module.exports.removeEmpty = removeEmpty;
