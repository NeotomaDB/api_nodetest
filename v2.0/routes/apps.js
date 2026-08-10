'use strict';
/*

apps.js
By: Michael Stryker, Simon Goring
Last Updated: Aug 19, 2021

 */

const express = require('express');
const router = express.Router();
const handlers = require('../handlers/apps_handlers');
const {requireAuth} = require('../helpers/validation/sessionauth');

router.get('/', function(req, res, next) {
  res.send('NeotomaDB apps API: please provide a valid request');
});


router.post('/logout', requireAuth, async function(req, res) {
  const db = req.app.locals.db;
  try {
    await db.none(
      `UPDATE ap.orcidlogins
          SET expiresat = now(),
          loggedoutat = now()
        WHERE sessionuuid = $1`,
      [req.user.sessionuuid]
    );
    res.status(200).json({status: 'success', message: 'Session ended'});
  } catch (err) {
    // This used to discard `err` outright, so a failed logout looked identical
    // whether the column was missing, the role lacked UPDATE, or the BEFORE
    // UPDATE trigger's function wasn't there. pg-promise hangs the useful parts
    // off the error object. Only a prefix of the session uuid is logged — the
    // whole value is a live credential.
    console.error('logout failed: ' + JSON.stringify({
      message: err.message,
      code: err.code,
      detail: err.detail,
      hint: err.hint,
      schema: err.schema,
      table: err.table,
      column: err.column,
      routine: err.routine,
      session: String(req.user.sessionuuid).slice(0, 8) + '...',
    }));
    const body = {status: 'error', message: 'Logout failed'};
    // api-dev runs with NODE_ENV=dev (cloudformation-template.yaml sets it from
    // the Environment parameter), so the reason comes back in the response
    // there and stays hidden in production.
    if (process.env.NODE_ENV !== 'production') {
      body.data = {
        message: err.message,
        code: err.code,
        detail: err.detail,
        hint: err.hint,
      };
    }
    res.status(500).json(body);
  }
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
// Gives the logged in user their orcid, contactid and steward databases.
router.get('/orcids/steward', requireAuth, handlers.stewardHandler);
// Gives the contact with an orcid.
router.get('/orcids/orcid', handlers.orcid_contact);
router.get('/datasetpi', handlers.datasetsbypi);
router.get('/exttax', handlers.externaltaxonquery);
router.post('/orcids/validate', handlers.validateusers);
router.get('/contacts/:contactid/datasets', handlers.contact_datasets);
router.get('/nativelands', handlers.sendNativeLands);

router.get('/depenvt', handlers.depenvt);

module.exports = router;
