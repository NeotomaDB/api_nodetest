/*

dbtables.js
By: Michael Stryker
Last Updated: September 14, 2017


 */

var express = require('express');
var router = express.Router();

var handlers = require('../handlers/dbtables_handlers');

router.get('/', function(req, res, next) {
  res.send('NeotomaDB dbtables API: please provide a valid request');
});

//router.get('/RelativeAgeScales', handlers.relativeagescales);


module.exports = router;
