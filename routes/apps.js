/*

apps.js
By: Michael Stryker
Last Updated: September 13, 2017


 */

var express = require('express');
var router = express.Router();

var handlers = require('../handlers/apps_handlers');



router.get('/', function(req, res, next) {
  res.send('NeotomaDB apps API: please provide a valid request');
});

router.get('/DatasetTypes', handlers.datasettypes);


module.exports = router;
