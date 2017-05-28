var express = require('express');
var router = express.Router();

var db = require('../queries');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/api-docs');
  //res.render('index', { title: 'Express' });
});

// Note, I'm getting a response that says definition is deprecated.

/**
* @swagger
* definition:
*   geopolitical:
*     properties:
*       gpid:
*         type: integer
*         format: int64
*       gpname:
*         type: string
*/

/**
* @swagger
* /v2/data/geopoliticalunits:
*   get:
*     summary: Returns information about geopolitical units.
*     parameters:
*       - name: gpid
*         in: path
*         description: Numeric ID for the geopolitical unit.
*         required: false
*         type: integer
*       - name: gpname
*         in: query
*         description: Name of the geopolitical unit.
*         required: false
*         type: string
*     produces:
*       - application/json
*     responses:
*       '200':
*         description: An array of geopolitical units.
*         schema:
*           type: array
*           items:
*             $ref: '#/definitions/geopolitical'
*/


router.get('/v2/data/geopoliticalunits', db.geopoliticalunits);
router.get('/v2/data/geopoliticalunits/:gpid', db.geopoliticalunits);

// Note, I'm getting a response that says definition is deprecated.

/**
* @swagger
* definition:
*   publication:
*     properties:
*       PublicationID:
*         type: integer
*       Year:
*         type: string
*       PubType:
*         type: string
*       Authors:
*         type: array
*       Citation:
*         type: string
*/

/**
 * @swagger
 * /v2/data/publication:
 *   get:
 *     summary: Returns information about Neotoma publications
 *     description: Returns information about Neotoma publications
 *     parameters:
 *       - name: pubid
 *         description: Numeric ID for publications.
 *         in: path
 *         required: false
 *         type: integer
 *         format: int32
 *       - name: datasetid
 *         description: Related dataset identifier.
 *         in: query
 *         required: false
 *         type: integer
 *         format: int32
 *       - name: siteid
 *         description: Related site identifier.
 *         in: query
 *         required: false
 *     	   type: integer
 *     	   format: int32
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of geopolitical units.
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/publication'
*/

router.get('/v2/data/publications/', db.publications);
router.get('/v2/data/publications/:pubid', db.publications);

/**
* @swagger
* definition:
*   dbtables:
*     properties:
*       type: object
*/

/**
* @swagger
* /v2/data/dbtables:
*   get:
*     summary: Returns the named Neotoma Database table.
*     description: Returns the named Neotoma Database table.
*     parameters:
*       - name: table
*         description: Table name.
*         in: path
*         required: true
*         type: string
*     produces:
*       - application/json
*     responses:
*       200:
*        description: Returned table.
*        schema:
*          type: array
*          items:
*            $ref: '#/definitions/dbtables'
*/

router.get('/v2/dbtables/:table', db.dbtables);

/**
* @swagger
* definition:
*   chronology:
*     properties:
*       ChronologyID:
*         type: integer
*         format: int64
*       controls:
*         type: object
*         properties:
*           ChronControlID:
*             type: integer
*             format: int64
*           Age:
*             type: number
*             format: float
*           AgeYounger:
*             type: number
*             format: float
*           AgeOlder:
*             type: number
*             format: float
*           ControlType:
*             type: string
*           Depth:
*             type: number
*             format: float
*           Thickness:
*             type: number
*             format: float
*       Default:
*         type: boolean
*       ChronologyName:
*         type: string
*       AgeType:
*         type: string
*       AgeModel:
*         type: integer
*         format: int64
*       AgeYounger:
*         type: number
*         format: float
*       AgeOlder:
*         type: number
*         format: float
*       Notes:
*         type: string
*       DatePrepared:
*         type: string
*         format: date
*       Datasets:
*         type: object
*         properties:
*           DatasetID:
*             type: integer
*             format: int64
*           DatasetType:
*             type: string
*       
*       
*/

/**
* @swagger
* /v2/data/chronology:
*   get:
*     summary: Chronology metadata for a dataset.
*     description: Returns the chronology and chronological controls used for a dataset age model.
*     parameters:
*       - name: chronid
*         description: Unique chronology identifier.
*         in: path
*         required: true
*         type: string
*     produces:
*       - application/json
*     responses:
*       200:
*        description: Chronology
*        schema:
*          type: object
*          items:
*            $ref: '#/definitions/chronology'
*/
router.get('/v2/data/chronology', db.chronology);
router.get('/v2/data/chronology/:id', db.chronology);

/**
* @swagger
* definition:
*   contact:
*     properties:
*       ContactID:
*         type: integer
*         format: int64
*       ContactName:
*         type: string
*       GivenName:
*         type: string
*       FamilyName:
*         type: string
*       LeadingInitials:
*         type: string
*       Title:
*         type: string
*       Suffix:
*         type: string
*       ContactStatus:
*         type: string
*       Address:
*         type: string
*       Email:
*         type: string
*       URL:
*         type: string
*       Phone:
*         type: string
*       Notes:
*         type: string
*       AliasID:
*         type: integer
*         format: int32
*/

/**
* @swagger
* /v2/data/contacts:
*   get:
*     summary: Contact information for Neotoma contributors.
*     description: Returns researcher contact information associated with a record.
*     parameters:
*       - name: contactid
*         description: Unique contact identifier.
*         in: path
*         required: true
*         type: integer
*         format: int64
*     produces:
*       - application/json
*     responses:
*       200:
*        description: Contact
*        schema:
*          type: object
*          items:
*            $ref: '#/definitions/contact'
*/
router.get('/v2/data/contacts/', db.contacts);
router.get('/v2/data/contacts/:id', db.contacts);

/**
* @swagger
* definition:
*   occurrence:
*     properties:
*       OccurID: 
*         type: integer
*         format: int64
*       Age:
*         type: number
*         format: float
*       TaxonID:
*         type: integer
*         format: int32
*       TaxonName:
*         type: string
*       AgeYounger:
*         type: number
*         format: float
*       AgeOlder:
*         type: number
*         format: float
*       DatasetID:
*         type: integer
*         format: int32
*       DatabaseName:
*         type: string
*       DatasetType:
*         type: string
*       SiteName:
*         type: string
*       SiteID: 
*         type: integer
*         format: int32
*       Altitude:
*         type: number
*         format: float
*       LongitudeWest:
*         type: number
*         format: float
*       LongitudeEast:
*         type: number
*         format: float
*       LatitudeNorth:
*         type: number
*         format: float
*       LatitudeSouth:
*         type: number
*         format: float
*/


/**
* @swagger
* /v2/data/occurrence:
*   get:
*     summary: Individual occurrence records for Neotoma records.
*     description: Returns occurrence information for a particular taxon, geographic region or temporal slice.
*     parameters:
*       - name: occid
*         description: Unique occurrence identifier.
*         in: path
*         required: true
*         type: integer
*         format: int64
*     produces:
*       - application/json
*     responses:
*       200:
*        description: Occurrence
*        schema:
*          type: object
*          items:
*            $ref: '#/definitions/occurrence'
*/

router.get('/v2/data/occurrence/', db.occurrence);
router.get('/v2/data/occurrence/:id', db.occurrence);

/**
* @swagger
* definition:
*   pollen:
*     properties:
*       TaxonName:
*         type: string
*       EcolGroups:
*         type: array
*         items:
*           type: string
*       TaxonCode: 
*         type: string
*       Author:
*         type: string
*       PublicationID:
*         type: integer
*         format: int32
*       TaxonID:
*         type: integer
*         format: int32
*       TaxaGroupID:
*         type: string
*       HigherTaxonID:
*         type: integer
*         format: int32
*       Extinct:
*         type: boolean
*       Notes:
*         type: string
*/

/**
 * @swagger
 * /v2/data/pollen:
 *   get:
 *     summary: Pollen data from Neotoma.
 *     description: Returns information about pollen.
 *     parameters:
 *       - name: taxonid
 *         description: Numeric ID for taxa.
 *         in: path
 *         required: false
 *         type: integer
 *         format: int32
 *       - name: taxonname
 *         description: Name of the taxon, can include wildcards.
 *         in: query
 *         required: false
 *         type: string
 *       - name: nametype
 *         description: Not sure.
 *         in: query
 *         required: false
 *         type: string
 *       - name: taxonids
 *         description: Numeric ID for taxa.
 *         in: query
 *         required: false
 *         type: array
 *         items:
 *           type: integer
 *           format: int32
 *       - name: ageyoung
 *         description: Most recent age, in calendar years before present.
 *         in: query
 *         required: false
 *         type: number
 *         format: float
 *       - name: ageold
 *         description: Oldest age, in calendar years before present.
 *         in: query
 *         required: false
 *         type: number
 *         format: float
 *       - name: agedocontain
 *       - name: coords
 *       - name: bbox
 *       - name: wkt
 *       - name: sitename
 *         description: Name of site for pollen record.
 *         in: query
 *         required: false
 *         type: string
 *       - name: siteid
 *         description: Numeric site ID.
 *         in: query
 *         required: false
 *         type: integer
 *         format: int32
 *       - name: format
 *       - name: limit
 *       - name: offset
 *       - name: fields
 *       - name: vocab
 *       - name: occurrences
 *     produces:
 *       - application/json
 *     responses:
 *       200:
*         description: A pollen response..
*         schema:
*           type: array
*           items:
*             $ref: '#/definitions/pollen'
*/

router.get('/v2/data/pollen/', db.pollen);
router.get('/v2/data/pollen/:id', db.pollen);

/**
* @swagger
* definition:
*   taxa:
*     properties:
*       TaxonName:
*         type: string
*       EcolGroups:
*         type: array
*         items:
*           type: string
*       TaxonCode: 
*         type: string
*       Author:
*         type: string
*       PublicationID:
*         type: integer
*         format: int32
*       TaxonID:
*         type: integer
*         format: int32
*       TaxaGroupID:
*         type: string
*       HigherTaxonID:
*         type: integer
*         format: int32
*       Extinct:
*         type: boolean
*       Notes:
*         type: string
*/

/**
 * @swagger
 * /v2/data/taxa:
 *   get:
 *     summary: Taxonomic information.
 *     description: Returns information about a taxon and (if requested) related taxa.
 *     parameters:
 *       - name: taxonid
 *         description: Numeric ID for taxa.
 *         in: path
 *         required: false
 *         type: integer
 *       - name: datasetid
 *         description: Related dataset identifier.
 *         in: query
 *         required: false
 *         type: integer
 *       - name: siteid
 *         description: Related site identifier.
 *         in: query
 *         required: false
 *     	   type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
*         description: A taxon or array of taxa.
*         schema:
*           type: array
*           items:
*             $ref: '#/definitions/taxa'
*/

router.get('/v2/data/taxa/', db.taxa);
router.get('/v2/data/taxa/:id', db.taxa);

/**
* @swagger
* definition:
*   sites:
*     properties:
*       SiteID:
*         type: integer
*         format: int64
*       SiteName:
*         type: string
*       SiteDescription:
*         type: string
*       LongitudeWest:
*         type: float
*       LongitudeEast:
*         type: float
*       LatitudeNorth:
*         type: float
*       LatitudeSout:
*         type: float
*       Altitude:
*         type: float
*       CollectionUnits:
*         type: object
*         properties:
*           CollectionUnitID:
*             type: integer
*             format:  int64
*           Handle:
*             type: string
*           CollType:
*             type: string
*           Datasets:
*             type: object
*             properties:
*               DatasetType:
*                 type: string
*               DatasetID:
*                 type: integer
*                 format: int64
*/

/**
 * @swagger
 * /v2/data/sites:
 *   get:
 *     summary: Site information.
 *     description: Returns information about Neotoma publications
 *     parameters:
 *       - name: pubid
 *         description: Numeric ID for publications.
 *         in: path
 *         required: false
 *         type: integer
 *       - name: datasetid
 *         description: Related dataset identifier.
 *         in: query
 *         required: false
 *         type: integer
 *       - name: siteid
 *         description: Related site identifier.
 *         in: query
 *         required: false
 *     	   type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
*         description: An array of geopolitical units.
*         schema:
*           type: array
*           items:
*             $ref: '#/definitions/sites'
*/

router.get('/v2/data/sites/', db.sites);
router.get('/v2/data/sites/:id', db.sites);

module.exports = router;
