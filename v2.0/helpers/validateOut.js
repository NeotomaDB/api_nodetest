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

module.exports.validateOut = validateOut;
