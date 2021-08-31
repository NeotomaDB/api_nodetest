/*

apps.js
By: Michael Stryker, Simon Goring
Last Updated: Aug 19, 2021

 */

var express = require('express');

var router = express.Router();

var handlers = require('../handlers/apps_handlers');

router.get('/', function (req, res, next) {
  res.send('NeotomaDB apps API: please provide a valid request');
});

router.get('/authorpis', handlers.authorpis);

router.get('/collectiontypes', handlers.collectiontypes);

router.get('/datasettypes', handlers.datasettypes);

router.get('/depositionalenvironments/root', handlers.depositionalenvironments);

router.get('/keywords', handlers.keywords);

router.get('/taphonomysystems', handlers.taphonomysystems);

router.get('/taxaindatasets', handlers.taxaindatasets);

router.get('/taxagrouptypes', handlers.taxagrouptypes);


module.exports = router;
