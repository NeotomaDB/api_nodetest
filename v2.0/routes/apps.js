'use strict';
/*

apps.js
By: Michael Stryker, Simon Goring
Last Updated: Aug 19, 2021

 */

const express = require('express');
const router = express.Router();
const handlers = require('../handlers/apps_handlers');

router.get('/', function(req, res, next) {
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
router.get('/constdb/datasets', handlers.datasetsummary);
router.get('/constdb/datasetuploads', handlers.datasetuploads);
router.get('/constdb/datasetages', handlers.datasetranges);
router.get('/constdb', handlers.databasesummaries);
router.get('/contactsummary/:datasetid', handlers.contactoverview);
// Gives the orcid by the contactid.
router.get('/orcids/contact', handlers.contact_orcid);
// Gives the contact with an orcid.
router.get('/orcids/orcid', handlers.orcid_contact);
router.get('/datasetpi', handlers.datasetsbypi);
router.get('/exttax', handlers.externaltaxonquery);
router.post('/orcids/validate', handlers.validateusers);
router.get('/contacts/:contactid/datasets', handlers.contact_datasets);
router.get('/nativelands', handlers.sendNativeLands);

router.get('/depenvt', handlers.depenvt);

module.exports = router;
