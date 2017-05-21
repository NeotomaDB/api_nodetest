var express = require('express');
var router = express.Router();

var db = require('../queries');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/v2/data/geopoliticalunits/', db.geopoliticalunits);
router.get('/v2/data/geopoliticalunits/:id', db.geopoliticalunit_id);

router.get('/v2/data/publications/', db.publications);

router.get('/v2/data/publications/:id', db.publication_id);

router.get('/v2/data/table/', db.table);
// router.get('/v2/data/site/', db.site);

module.exports = router;
