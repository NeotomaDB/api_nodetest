/*

inspect.js
By: Michael Stryker
Last Updated: September 13, 2017


 */

var express = require('express');
var router = express.Router();

var handlers = require('../handlers/inspect_handlers');



router.get('/', function(req, res, next) {
  res.send('NeotomaDB apps API: please provide a valid request');
});



router.post('/compare', handlers.compare);


module.exports = router;
