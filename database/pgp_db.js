/**
 * Create connection object to open database connection to the required database.
 * @param {req} An http Request object passed from the calling function.
 * @returns {Database} A database connection.
 */

function dbheader (req) {
  var out = {
    'host': process.env.RDS_HOSTNAME,
    'user': process.env.RDS_USERNAME,
    'database': process.env.RDS_DATABASE,
    'password': process.env.RDS_PASSWORD,
    'port': process.env.RDS_PORT,
    'ssl': true,
    'query_timeout': 3000
  }
  console.log(out)
  return pgp(out)
}

module.exports = {
  dbheader: dbheader
}
