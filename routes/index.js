var express = require('express');
var router = express.Router();

var db = require('../queries');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/v2/data/geopoliticalunits', db.geopoliticalunits);
router.get('/v2/data/geopoliticalunits/:id', db.geopoliticalunits);

router.get('/v2/data/publications/', db.publications);
router.get('/v2/data/publications/:pubid', db.publications);

router.get('/v2/data/dbtables/', db.dbtables);

router.get('/v2/data/chronology', db.chronology);
router.get('/v2/data/chronology/:id', db.chronology);

router.get('/v2/data/contacts/', db.contacts);
router.get('/v2/data/contacts/:id', db.contacts);

router.get('/v2/data/occurrence/', db.contacts);
router.get('/v2/data/occurrence/:id', db.contacts);

router.get('/v2/data/pollen/', db.contacts);
router.get('/v2/data/pollen/:id', db.contacts);

router.get('/v2/data/taxa/', db.contacts);
router.get('/v2/data/taxa/:id', db.contacts);

router.get('/v2/data/site/', db.contacts);
router.get('/v2/data/site/:id', db.contacts);

router.get('/v2/data/sites/', db.contacts);
router.get('/v2/data/sites/:id', db.contacts);

module.exports = router;
