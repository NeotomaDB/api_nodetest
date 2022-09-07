
// get global database object
const db = require('../../../database/pgp_db');
const pgp = db.$config.pgp;


module.exports.checkTaxa = checkTaxa;
module.exports.checkKeyword = checkKeyword;
module.exports.checkGeoPol = checkGeoPol;
module.exports.checkContact = checkContact;
