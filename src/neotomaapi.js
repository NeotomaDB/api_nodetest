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
    const messageout = {'hasExecuted': e.client.hasExecuted};
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
  const output = Object.keys(obj).forEach((key) => {
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
  let sep = String(x).split(',').map((x) => x.trim());
  // A trailing or doubled comma ("1,2,3,") would otherwise become NaN and a
  // database error. If nothing is left the original behaviour is kept.
  const tokens = sep.filter((x) => x !== '');
  if (tokens.length > 0) {
    sep = tokens;
  }

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
  if (value && !value.every(Number.isInteger)) {
    // A database failure rejects the promise. The caller owns the response
    // and answers it once in its own .catch. Answering here as well, and
    // returning `res` as if it were the looked-up ids, sent two responses and
    // passed the response object into the next query.
    return db.any(query, outobj)
        .then(function(data) {
          return data.map((x) => x.output);
        });
  }
  return Promise.resolve(value);
}


/**
 * True when a parsed id list (from `ifUndef(x, 'sep')`) is absent or holds only
 * integers. Anything else ("abc", "null") would reach the database as text and
 * fail there with an HTTP 500 that names an internal function.
 * @param {any} ids An array from commaSep(), or null.
 * @return {boolean}
 */
function allIntegers(ids) {
  return ids === null || typeof ids === 'undefined' ||
    (Array.isArray(ids) && ids.every(Number.isInteger));
}

/**
 * Send an HTTP 400 in the standard failure shape.
 * @param {res} res An Express response object.
 * @param {string} message What the caller should change.
 * @return {res} The response.
 */
function badRequest(res, message) {
  return res.status(400)
      .json({
        status: 'failure',
        data: null,
        message: message,
      });
}

/**
 * Express `router.param` callback: path parameters that must be integer lists.
 * Used for routes such as /sites/:siteid, where 'abc' used to reach the
 * database and come back as HTTP 500.
 * @param {req} req An Express request object.
 * @param {res} res An Express response object.
 * @param {next} next The Express next function.
 * @param {string} value The value of the path parameter.
 * @param {string} name The name of the path parameter.
 * @return {any}
 */
function integerParam(req, res, next, value, name) {
  const tokens = String(value).split(',').map((x) => x.trim())
      .filter((x) => x !== '');
  if (tokens.length > 0 && tokens.every((x) => /^\d+$/.test(x))) {
    return next();
  }
  // /datasets/db is a documented route that shares the :datasetid name.
  if (name === 'datasetid' && String(value) === 'db') {
    return next();
  }
  return badRequest(res, name + ' must be an integer or a comma separated ' +
    'list of integers.');
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
    'message': msg,
  };
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
function success(query, data, msg) {
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

/**
 * Take in a location string that may be either WKT or geojson
 * and parse it to valid WKT. Best case scenario is that it's a
 * valid WKT string and we can just keep going:
 * @param {req} location A string that contains either a
 * valid geoJSON or WKT string.
 * @param {res} resolve A resolve object from express.
 * @param {next} next The next for express.
 * @return {bool} Is the user logged in?
 */

const checkCookies = function(req, res, next) {
  const ippaddr = req.socket.remoteAddress;
  const cookies = req.cookies;
  console.log(cookies);
  console.log(ippaddr);
  return cookies;
};


module.exports.checkCookies = checkCookies;
module.exports.failure = failure;
module.exports.success = success;
module.exports.validateOut = validateOut;
module.exports.sql = sql;
module.exports.ifUndef = ifUndef;
module.exports.commaSep = commaSep;
module.exports.removeEmpty = removeEmpty;
module.exports.checkObject = checkObject;
module.exports.allIntegers = allIntegers;
module.exports.badRequest = badRequest;
module.exports.integerParam = integerParam;
module.exports.getparam = getparam;
module.exports.parseLocations = parseLocations;
