
// get global database object
var request = require('request');

module.exports = {
  compare: compare
};

// Defining the query functions:

/* All the Endpoint functions */
function compare (req, res, next) {
  var data = null;
  /*
1. call v1.5 endpoint
2. call v2.0 endpoint

with result compare first v1.5 object to first v2.0 object
by stepping through keys

//request.get({url:url, oauth:oauth, qs:qs, json:true}, function (e, r, user) {
      console.log(user)

*/
  const v15URL = "http://api-dev.neotomadb.org/v1.5/apps/DatasetTypes";// req.body.ep1;
  const v1URL = "http://api.neotomadb.org/v1/apps/DatasetTypes";// req.body.ep2;
  request.get({ url: v1URL }, function (err, response, body) {
    data = JSON.stringify(response);
  }).then(
    // db.query('select * from ap.getcollectiontypes()')
    // .then(function(data){
    res.status(200)
      .type('application/json')
      .jsonp({
        success: 1,
        status: 'success',
        data: data,
        message: 'Returned API endpoint comparison'
      })
      // })
      .catch(function (err) {
        return next(err);
      })
  ).catch(function (err) {
    return next(err);
  })
}
