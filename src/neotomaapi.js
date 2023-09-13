const path = require('path');
var assert = require('assert');

const promise = require('bluebird')

const options = {
  // Initialization Options
  promiseLib: promise,
  capSQL: true,
  query (e) {
    var date = new Date()
    var messageout = { 'hasExecuted': e.client.hasExecuted }
    // Exclude the big chunky query:
    if (e.query.match(/CONCAT.*pronamespace = n.oid/)) {
      messageout.query = 'List all functions'
    } else if (e.query.match(/WHERE proname LIKE/)) {
      messageout.query = 'Match function schema'
    } else {
      messageout.query = e.query
      messageout.db = { client: e.client.user, database: e.client.database, host: e.client.host }
    }
    console.log(date.toISOString() + ' ' + JSON.stringify(messageout))
  },
  error (err, e) {
    var date = new Date()
    // Exclude the big chunky query:
    console.log(JSON.stringify(err))
    var messageout = { 'error': JSON.stringify(err), 'query': e.query }
    messageout.db = { 'client': e.client.user, 'database': e.client.database, 'host': e.client.host }
    console.log(date.toISOString() + ' ' + JSON.stringify(messageout))
  }
}

const pgp = require('pg-promise')(options)

const { geojsonToWKT, wktToGeoJSON } = require('@terraformer/wkt');

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
  var sep = String(x).split(',').map(x => x.trim())

  if (sep.map(x => /^\d+$/.test(x)).every(x => x === false)) {
    return sep;
  } else {
    return sep.map(x => parseInt(x, 10));
  }
}

/* Takes integer values and passes them into a query to the database.
   This is used when we need to pre-process values for an API call. */
function checkObject (req, res, query, value, outobj) {
  let db = req.app.locals.db
  if (value) {
    if (!value.every(Number.isInteger)) {
      value = db.any(query, outobj)
        .then(function (data) {
          return data.map(x => x.output)
        })
        .catch(function (err) {
          return res.status(500)
            .json({
              status: 'failure',
              message: err.message,
              query: outobj
            });
        });
    }
  }
  return Promise.resolve(value);
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

function getparam (req, name) {
  let result = { success: false, message: null, data: null };

  function clean (obj) {
    let output = Object.keys(obj).filter(key => obj[key] !== undefined);
    return output;
  }

  const testquery = { body: clean(req.body),
    params: clean(req.params),
    query: clean(req.query) }

  // First ensure that there are no duplicate keys:
  let unstring = Object.values(testquery).flat()

  if (unstring.length !== [...new Set(unstring)].length) {
    result = {
      success: false,
      message: 'Duplicate keys present across params, query and body',
      data: null };

    return result;
  }

  let output = {
    body: JSON.parse(JSON.stringify(req.body)),
    params: JSON.parse(JSON.stringify(req.params)),
    query: JSON.parse(JSON.stringify(req.query)) }

  result = {
    success: true,
    message: null,
    data: Object.assign(output.body, output.params, output.query) }

  return result;
}

function customFilter (object, result) {
  if (object.hasOwnProperty('coordinates')) {
    result.push(object.coordinates);
  }

  for (var i = 0; i < Object.keys(object).length; i++) {
    if (typeof object[Object.keys(object)[i]] === 'object') {
      customFilter(object[Object.keys(object)[i]], result);
    }
  }
}

function parseLocations (location) {
  // Take in a location string that may be either WKT or geojson and parse it to valid WKT.
  // Best case scenario is that it's a valid WKT string and we can just keep going:
  try {
    assert.strictEqual(typeof location, 'string')
    var test = wktToGeoJSON(location)
    var outloc = location
  } catch (err) {
    if (err.name === 'Error') {
      // Terraformer doesn't give us a super great error name :)
      // Here we know it's not valid WKT, so we can try geoJSON:
      var parsedloc = JSON.parse(location.replace(/'/g, '"'))
      var geoms = []
      customFilter(parsedloc, geoms)
      try {
        outloc = geojsonToWKT({ 'type': 'MultiPolygon', 'coordinates': geoms })
      } catch (err) {
        console.log(err)
      }
      // The WKT parser only pulls geometries, so we need to unnest them:
    } else if (err.name === 'AssertionError') {
      throw new Error('Location must be passed as a string.')
    }
  }
  return outloc
}

module.exports.failure = failure;
module.exports.success = success;
module.exports.validateOut = validateOut;
module.exports.sql = sql;
module.exports.ifUndef = ifUndef;
module.exports.commaSep = commaSep;
module.exports.removeEmpty = removeEmpty;
module.exports.checkObject = checkObject;
module.exports.getparam = getparam;
module.exports.parseLocations = parseLocations;
