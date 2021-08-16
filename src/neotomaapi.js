import { join } from 'path';

import { $config } from '../../../database/pgp_db';
var pgp = $config.pgp;

// Helper for linking to external query files:
function sql (file) {
  const fullPath = join(__dirname, file);
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

const _ifUndef = ifUndef;
export { _ifUndef as ifUndef };

const _sql = sql;
export { _sql as sql };

const _commaSep = commaSep;
export { _commaSep as commaSep };
