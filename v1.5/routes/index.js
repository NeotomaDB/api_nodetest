/*

index.js
By: Simon Goring
Last Updated: September 14, 2017
Updated by: Michael Stryker

 */

var express = require('express');
var router = express.Router();

/* GET home page. */
// This just reroutes to the swagger docs when you go to the main endpoint.
router.get('/', function(req, res, next) {
  res.redirect('/api-docs');
  //res.render('index', { title: 'Express' });
});

module.exports = router;