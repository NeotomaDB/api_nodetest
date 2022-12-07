/*
* v2.0/routes/data.js
* By: Simon Goring, Michael Stryker
*/

var express = require('express');
var router = express.Router();
let apicache = require('apicache');
let cache = apicache.middleware;
const onlyStatus200 = (req, res) => res.statusCode === 200
const cacheSuccesses = cache('5 minutes', onlyStatus200)

var handlers = require('../handlers/data_handlers');

router.get('/chronologies/:chronologyid', handlers.chronologiesbyid);
router.get('/contacts/:contactid', handlers.contactsbyid);
router.get('/contacts/', handlers.contactquery);

router.get(['/datasets_elc/', '/datasets_elc/:datasetid'], handlers.datasetquery_elc);

router.get(['/sites/:siteid/datasets', '/datasets/:datasetid',
  '/geopoliticalunits/:gpid/datasets', '/datasets', '/datasets/:datasetid'], cacheSuccesses, handlers.datasetquery)
router.post(['/sites/:siteid/datasets', '/geopoliticalunits/:gpid/datasets', '/datasets',
  '/datasets/:datasetid', '/datasets/db'], handlers.datasetquery)

router.get('/datasets/:datasetid/chronologies', handlers.chronologiesbydsid);
router.get('/datasets/:datasetid/contacts', handlers.contactsbydataid);
router.get('/datasets/:datasetid/doi', handlers.doibydsid);
router.get('/datasets/:datasetid/lithology', handlers.lithologybydsid);
router.get('/datasets/:datasetid/publications', handlers.publicationbydataset);
router.get('/datasets/:datasetid/taxa/', handlers.taxonbydsid);
router.get(['/dbtables/:table', '/dbtables'], handlers.dbtables);

router.post(['/downloads'], handlers.downloadbyid);
router.get(['/downloads/:datasetid', '/downloads/'], cacheSuccesses, handlers.downloadbyid);

router.get('/frozen/:datasetid', handlers.frozen);
router.get('/geopoliticalunits', handlers.geopoliticalunits);
router.get('/geopoliticalunits/:gpid', handlers.geopoliticalbyid);
router.get('/occurrences', handlers.occurrencequery);
router.get('/occurrences/:occurrenceid', handlers.occurrencebyid);
// router.get('/oxcal/calibrate', handlers.oxcalibrate)
router.get('/pollen/:id', handlers.pollen);
router.get('/pollen/', handlers.pollen);
router.get('/publications', handlers.publicationquery);
router.get('/publications/:pubid', handlers.publicationid);
router.get('/sites/:siteid/chronologies', handlers.chronologiesbystid);
router.get('/sites/:siteid/contacts', handlers.contactsbysiteid);
router.get('/sites/:siteid/datasets_elc', handlers.datasetsbysite_elc); // Takes integers, including comma separated

router.get('/sites/:siteid/geopoliticalunits', handlers.geopolbysite);
router.get('/sites/:siteid/publications', handlers.publicationbysite);

router.post(['/sites/', '/contacts/:contactid/sites',
  '/datasets/:datasetid/sites', '/geopoliticalunits/:gpid/sites'], handlers.sitesquery); // Goes to the queries.
router.get(['/sites/', '/sites/:siteid',
  '/contacts/:contactid/sites', '/datasets/:datasetid/sites', '/geopoliticalunits/:gpid/sites'], cacheSuccesses, handlers.sitesquery); // Goes to the queries.

router.get('/summary/dsdbmonth/', handlers.dsdbmonth);
router.get('/summary/dstypemonth/', handlers.dstypemonth);
router.get('/summary/rawbymonth/', handlers.rawbymonth);
router.get('/summary/sparklines/', handlers.sparklines);
router.get('/taxa/:taxonid', handlers.taxonbyid);
router.get('/taxa/:taxonid/occurrence', handlers.occurrencebytaxon);
router.get('/taxa/:taxonid/occurrences', handlers.occurrencebytaxon);
router.get('/taxa/', handlers.taxonquery);
router.get('/datasets/:datasetid/specimens', handlers.specimensbydsid);
router.get('/specimens/:specimenid', handlers.specimensbyid);

module.exports = router;
