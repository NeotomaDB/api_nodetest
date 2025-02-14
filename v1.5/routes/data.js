'use strict';
/*

data.js
By: Simon Goring
Last Updated: September 14, 2017
Updated by: Michael Stryker


 */

const express = require('express');
const router = express.Router();

const handlers = require('../handlers/data_handlers');

router.get('/', function(req, res, next) {
  res.redirect('/api-docs');
});

router.get('/chronologies/:id', handlers.chronology);
router.get('/contacts/', handlers.contactquery);
router.get('/contacts/:contactid', handlers.contactsbyid);

router.get('/datasets/:datasetid', handlers.datasets);
router.get('/datasets', handlers.datasets);
router.get('/datasets/:datasetid/publications', handlers.publicationbydataset);

router.get('/downloads/', handlers.downloads);
router.get('/downloads/:datasetid', handlers.downloads);

router.get('/geopoliticalunits/', handlers.geopoliticalunits);
router.get('/geopoliticalunits/:gpid', handlers.geopoliticalbyid);
router.get('/sites/:siteid/geopoliticalunits', handlers.geopolbysite);

router.get('/occurrence/', handlers.occurrencequery);
router.get('/occurrence/:occurrenceid', handlers.occurrencebyid);
router.get('/taxa/:taxonid/occurrence', handlers.occurrencebytaxon);

router.get('/pollen/', handlers.pollen);
router.get('/pollen/:id', handlers.pollen);

router.get('/publications/', handlers.publicationquery);
router.get('/publications/:pubid', handlers.publicationid);
router.get('/sites/:siteid/publications', handlers.publicationbysite);
router.get('/dataset/:datasetid/publications', handlers.publicationbydataset);

router.get('/sites/', handlers.sitesquery); // Goes to the queries.

// Takes integers, including comma separated
router.get('/sites/:siteid', handlers.sitesbyid);

// Takes a dataset ID.
router.get('/datasets/:datasetid/sites', handlers.sitesbydataset);

// router.get('/publications/:pubid/site', handlers.sitesbypublication);
router.get('/geopoliticalunits/:gpid/sites', handlers.sitesbygeopol);
// router.get('/contacts/:contactid/site', handlers.sitesbycontacts);

router.get('/taxa/:taxonid', handlers.taxonbyid);
router.get('/taxa/', handlers.taxonquery);

router.get('/occurrence/', handlers.occurrencequery);
router.get('/taxa/:taxonid/occurrence/', handlers.occurrencebytaxon);

// router for xml endpoint to feed recent uploads widget on website
router.get('/recentuploads/:months', handlers.recentuploadsquery);

module.exports = router;
