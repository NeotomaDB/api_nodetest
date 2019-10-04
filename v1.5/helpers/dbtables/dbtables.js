// Returns the data tables:
const path = require('path');
//get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;

// references to templated SQL query files
// Helper for linking to external query files:
function sql(file) {
    const fullPath = path.join(__dirname, file);
    return new pgp.QueryFile(fullPath, {minify: true});
}
const dbtablesQuery = sql('./dbtablesQuery.sql');

// Defining the query function:

function dbtables(req, res, next) {
  /*3 cases:
  1: tablename passed with or without offset, limit, sort, order, fields --> return set of records
  2: tablename and pkey value passed as id --> check if table is single field pkey, if so, return record
  3: no tablename passed --> return list of tables
  */
  //handle optional parameters: limit, offset, sort, order, format, fields

  //TODO: can't use CASE to set order by until have table|field lookup function

  //pass properties to template: schemaname, tablename, sortfield, order, offset, limit
  var query, sortField, hasSortField, sortOrder, limit, offset;
  //primitive value, thus assigned by value not by reference
  sortField = sortOrder = limit = offset = null;
  hasSortField = false; 

  if (req.query){
    if (req.query.sort){
      hasSortField = true;
      sortField = req.query.sort.toLowerCase();
      sortOrder = 'ASC';
      if (req.query.order ){
        req.query.order.toLowerCase() == 'd' ? sortOrder = 'DESC' : sortOrder = 'ASC';
      }
    }
    if (req.query.offset){
      var offsetVal = parseInt(req.query.offset);//returns NaN for " ", "", undefined, null
      if (!isNaN(offsetVal) && offsetVal > 0){
        offset = offsetVal;
      }
    }
    if (req.query.limit){
      var limitVal = parseInt(req.query.limit);//returns NaN for " ", "", undefined, null
      if (!isNaN(limitVal) && limitVal > 0){
        limit = limitVal;
      }
    }
  }
  //TODO: handle case 2
  if (!!req.params.table) {
    //case 1
    var tableName = req.params.table.toLowerCase();
    //var query = "SELECT * FROM ${schemaname~}.${tablename~}";
    query = dbtablesQuery;
  } else {
    //case 3  
    var query = "SELECT tablename FROM pg_tables WHERE schemaname='ndb';";
  }

  //set query params
  var qryParams = {
    schemaname: 'ndb',
    tablename: tableName, 
    sortfield: sortField,
    hasSortField: hasSortField,
    order: sortOrder,
    offset: offset,
    limit: limit,
    spacer: ' '
  }

  console.log(JSON.stringify(qryParams));

  db.any(query, qryParams)
    .then(function (data) {
      console.log('the dbtables query: '+ query);
      res.status(200)
        .jsonp({
          success: 1,
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      next(err);
    });
};

module.exports.dbtables = dbtables;