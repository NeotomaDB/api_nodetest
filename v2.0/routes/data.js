/*
* v2.0/routes/data.js
* By: Simon Goring, Michael Stryker
*/

var express = require('express');
var router = express.Router();

var handlers = require('../handlers/data_handlers');

router.get('/oxcal/calibrate', handlers.oxcalibrate)
router.get('/contacts/', handlers.contactquery);
router.get('/contacts/:contactid', handlers.contactsbyid);
router.get('/datasets/:datasetid/contacts', handlers.contactsbydataid);
router.get('/sites/:siteid/contacts', handlers.contactsbysiteid);
// router.get('/publications/:pubid/contacts', handlers.contactsbypubid);

router.get('/datasets_elc/', handlers.datasetquery_elc);
router.get('/datasets_elc/:datasetid', handlers.datasetbyid_elc);
router.get('/sites/:siteid/datasets_elc', handlers.datasetsbysite_elc); // Takes integers, including comma separated

router.get('/datasets/db', handlers.datasetsbydb);  // Take database names
router.get('/datasets/', handlers.datasetquery);
router.get('/datasets/:datasetid', handlers.datasetbyid);
router.get('/sites/:siteid/datasets', handlers.datasetsbysite); // Takes integers, including comma separated
router.get('/geopoliticalunits/:gpid/datasets', handlers.sitesbygeopol);

router.get('/frozen/:datasetid', handlers.frozen);

// router.get('/publications/:pubid/datasets', handlers.datasetsbypub);
// router.get('/contacts/:contactid/datasets', handlers.datasetsbycontact);

router.get('/dbtables/', handlers.dbtables);
router.get('/dbtables/:table', handlers.dbtables);

router.get('/downloads/', handlers.downloadbyid);
router.get('/downloads/:datasetid', handlers.downloadbyid);

router.get('/geopoliticalunits', handlers.geopoliticalunits);
router.get('/geopoliticalunits/:gpid', handlers.geopoliticalbyid);
router.get('/sites/:siteid/geopoliticalunits', handlers.geopolbysite);

router.get('/occurrences', handlers.occurrencequery);
router.get('/occurrences/:occurrenceid', handlers.occurrencebyid);
router.get('/taxa/:taxonid/occurrences', handlers.occurrencebytaxon);

router.get('/occurrences', handlers.occurrencequery);
router.get('/occurrences/:occurrenceid', handlers.occurrencebyid);
router.get('/taxa/:taxonid/occurrence', handlers.occurrencebytaxon);

router.get('/pollen/', handlers.pollen);
router.get('/pollen/:id', handlers.pollen);


router.get('/publications', handlers.publicationquery);
router.get('/publications/:pubid', handlers.publicationid);
router.get('/sites/:siteid/publications', handlers.publicationbysite);
router.get('/datasets/:datasetid/publications', handlers.publicationbydataset);

router.get('/sites/', handlers.sitesquery); // Goes to the queries.
router.get('/sites/:siteid', handlers.sitesbyid); // Takes integers, including comma separated
router.get('/datasets/:datasetid/sites', handlers.sitesbydataset); // Takes a dataset ID.
// router.get('/publications/:pubid/site', handlers.sitesbypublication);
router.get('/geopoliticalunits/:gpid/sites', handlers.sitesbygeopol);
router.get('/contacts/:contactid/sites', handlers.sitesbycontact);


router.get('/taxa/:taxonid', handlers.taxonbyid);
router.get('/taxa/', handlers.taxonquery);
router.get('/datasets/:datasetid/taxa/', handlers.taxonbydsid);


router.get('/chronologies/:chronologyid', handlers.chronologiesbyid);
router.get('/datasets/:datasetid/chronologies', handlers.chronologiesbydsid);
router.get('/sites/:siteid/chronologies', handlers.chronologiesbystid);

router.get('/summary/dstypemonth/', handlers.dstypemonth);
router.get('/summary/dsdbmonth/', handlers.dsdbmonth);
router.get('/summary/rawbymonth/', handlers.rawbymonth);

router.get('/datasets/:datasetid/doi', handlers.doibydsid);


module.exports = router;
