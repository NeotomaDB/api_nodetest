'use strict';
const path = require('path');
const assert = require('assert');

const promise = require('bluebird');

const options = {
  // Initialization Options
  promiseLib: promise,
  capSQL: true,
  query(e) {
    const date = new Date();
    let messageout = {'hasExecuted': e.client.hasExecuted};
    // Exclude the big chunky query:
    if (e.query.match(/CONCAT.*pronamespace = n.oid/)) {
      messageout.query = 'List all functions';
    } else if (e.query.match(/WHERE proname LIKE/)) {
      messageout.query = 'Match function schema';
    } else {
      messageout.query = e.query;
      messageout.db = {client: e.client.user,
        database: e.client.database,
        host: e.client.host};
    }
    console.log(date.toISOString() + ' ' + JSON.stringify(messageout));
  },
  error(err, e) {
    const date = new Date();
    // Exclude the big chunky query:
    console.log(JSON.stringify(err));
    let messageout = {'hasExecuted': e.client.hasExecuted,
      'error': JSON.stringify(err),
      'query': e.query};
    messageout.db = {'client': e.client.user,
      'database': e.client.database,
      'host': e.client.host};
    console.log(date.toISOString() + ' ' + JSON.stringify(messageout));
  },
};

const pgp = require('pg-promise')(options);

const {geojsonToWKT, wktToGeoJSON} = require('@terraformer/wkt');

/**
 * Removes empty or None objects from an object tree in a recursive way.
 * @param {object} obj A JS object that may contain None values or Nulls.
 * @return {object} An object with all empty elements removed.
 */
function removeEmpty(obj) {
  let output = Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key]);
    else if (obj[key] == null) delete obj[key];
  });
  return output;
};

// Helper for linking to external query files:
/**
 * Take a SQL file and parse it into a pg-promise QueryFile object.
 * @param {string} file A valid filename for a SQL object.
 * @return {QueryFile} A pgp.QueryFile object for use in querying the database.
 */
function sql(file) {
  const fullPath = path.join(__dirname, file);
  return new pgp.QueryFile(fullPath, {
    minify: true,
  });
}

/**
   * Parser for comma separated strings, returning either an array of
   * strings or integers. There is currently no support for float objects.
   * @param {string} x A string object containing commas from an API call.
   * @return {array} An array of integers or strings.
   */
function commaSep(x) {
  const sep = String(x).split(',').map((x) => x.trim());

  if (sep.map((x) => /^\d+$/.test(x)).every((x) => x === false)) {
    return sep;
  } else {
    return sep.map((x) => parseInt(x, 10));
  }
}


/**
 * Takes integer values and passes them into a query to the database.
 * This is used when we need to pre-process values for an API call.
 * For example, when we need to retrieve contact information by ID for
 * a second query.
 * @param {any} req The API request object.
 * @param {any} res The API response object.
 * @param {string} query A Valid SQL query.
 * @param {any} value The value (or array of values) to be queried.
 * @param {object} outobj A set of parameters passed in as an object.
 * @return {any} Either a response of status 500 (some error) or a 
 *  promise with the results.
 */
function checkObject (req, res, query, value, outobj) {
  const db = req.app.locals.db;
  if (value) {
    if (!value.every(Number.isInteger)) {
      value = db.any(query, outobj)
          .then(function(data) {
            return data.map((x) => x.output);
          })
          .catch(function(err) {
            return res.status(500)
                .json({
                  status: 'failure',
                  message: err.message,
                  query: outobj,
                });
          });
    }
  }
  return Promise.resolve(value);
}


/**
 * Quickly return value or null.
 * @param {string} x Any value passed in from an Express request object.
 * @param {string} opr An operation, one of either 'string',
 * 'sep', 'int' or 'float'.
* @return {any} Either the value of `x` or a `null` value.
 */
function ifUndef(x, opr) {
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
      case 'float':
        return parseFloat(x);
    }
  }
}

/**
 * Validate objects that are going to be passed from a param/query to a DB call.
 * The object is to ensure no non-null empty values get passed to the query,
 *  so we check for `undefined`, falsy and NaN values.
 * @param {object} outobj An object constructed from a response call.
 * @return {object} The validated object.
 */
function validateOut(outobj) {
  const keyLength = Object.keys(outobj).length - 1;

  for (let i = keyLength; i > -1; i--) {
    // Check for undefined values
    if (typeof outobj[Object.keys(outobj)[i]] === 'undefined' |
        outobj[Object.keys(outobj)[i]] === 'undefined') {
      outobj[Object.keys(outobj)[i]] = null;
    }
    // Check for stand-alone null values.
    if (typeof outobj[Object.keys(outobj)[i]] === 'number' &
      isNaN(outobj[Object.keys(outobj)[i]])) {
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

/**
 * An object to send when an API call fails
 * (TODO: Implement throughout for v2.1)
 * @param {string} query The query passed to the DB.
 * @param {string} msg
 * @return {object} An object containing the status 0 and some information.
 */
function failure(query, msg) {
  const failobj = {'status': 0,
    'data': null,
    'query': query,
    'message': msg};
  return failobj;
}

/**
 * An object to send when an API call succeeds
 * (TODO: Implement throughout for v2.1)
 * @param {string} query
 * @param {object} data
 * @param {string} msg
 * @return {object}
 */
function success (query, data, msg) {
  const success = {'status': 1,
    'data': data,
    'query': query,
    'message': msg};
  return success;
}

/**
 * Get a parameter from either the URL query or body.
 * @param {req} req The Express request object.
 * @param {string} name The name of the parameter to be recovered.
 * @return {object}
 */
function getparam(req, name) {
  let result = {success: false, message: null, data: null};

  /**
   * Clear out any objects where the value for a key is undefined.
   * @param {object} obj The object to be cleaned
   * @return {object} The object with no undefined values.
   */
  function clean(obj) {
    const output = Object.keys(obj).filter(key => obj[key] !== undefined);
    return output;
  }

  const testquery = {body: clean(req.body),
    params: clean(req.params),
    query: clean(req.query),
  };

  // First ensure that there are no duplicate keys:
  const unstring = Object.values(testquery).flat();

  if (unstring.length !== [...new Set(unstring)].length) {
    result = {
      success: false,
      message: 'Duplicate keys present across params, query and body',
      data: null};

    return result;
  }

  // Then parse the body, parameters and the query:
  const output = {
    body: JSON.parse(JSON.stringify(req.body)),
    params: JSON.parse(JSON.stringify(req.params)),
    query: JSON.parse(JSON.stringify(req.query)),
  };

  // Finally, flatten the objects into a single object with all
  // key-value pairs.
  result = {
    success: true,
    message: null,
    data: Object.assign(output.body, output.params, output.query),
  };

  return result;
}

/**
 * Cleans up a putative geoJSON object, looking for coordinates.
 * @param {object} object A geoJSON object.
 * @param {any} result
 */
function customFilter(object, result) {
  if (object.hasOwnProperty('coordinates')) {
    result.push(object.coordinates);
  }
  for (let i = 0; i < Object.keys(object).length; i++) {
    if (typeof object[Object.keys(object)[i]] === 'object') {
      customFilter(object[Object.keys(object)[i]], result);
    }
  }
}

/**
 * Take in a location string that may be either WKT or geojson
 * and parse it to valid WKT. Best case scenario is that it's a
 * valid WKT string and we can just keep going:
 * @param {string} location A string that contains either a
 * valid geoJSON or WKT string.
 * @return {string} A WKT formatted location or throws an error.
 */
function parseLocations(location) {
  try {
    assert.strictEqual(typeof location, 'string');
    assert.doesNotThrow(wktToGeoJSON(location));
    return location;
  } catch (err) {
    if (err.name === 'Error') {
      // Terraformer doesn't give us a super great error name :)
      // Here we know it's not valid WKT, so we can try geoJSON:
      const parsedloc = JSON.parse(location.replace(/'/g, '"'))
      let geoms = [];
      customFilter(parsedloc, geoms);
      try {
        const outloc = geojsonToWKT({
          'type': 'MultiPolygon',
          'coordinates': geoms});
        return outloc;
      } catch (err) {
        console.log(err);
      }
      // The WKT parser only pulls geometries, so we need to unnest them:
    } else if (err.name === 'AssertionError') {
      throw new Error('Location must be passed as a string.');
    }
  }
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
