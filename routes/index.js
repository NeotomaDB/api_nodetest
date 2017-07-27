/*

index.js
By: Simon Goring
Last Updated: July 9, 2017


 */

var express = require('express');
var router = express.Router();

var db = require('../queries');

/* GET home page. */
// This just reroutes to the swagger docs when you go to the main endpoint.
router.get('/', function(req, res, next) {
  res.redirect('/api-docs');
  //res.render('index', { title: 'Express' });
});

/* (Approximate) LINE NUMBERS & Status:
[ Use CTRL-G + Line number in Sublime Text ]

  36   - chronology
  123  - contacts
  187  - datasets
  234  - dbtablessites
  267  - downloads
         DownloadsCSV
         DownloadMultiple
         DownloadMultipleCSV
         DownloadZip
  301  - GeoPoliticalUnits
  339  - occurrence
  419  - pollen
  529  - publications
         SampleData
  586  - site
         sites
  585 - taxa

*/


/**

* @swagger
* definitions:
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
* definitions:
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
router.get('/v2/data/contacts/:contactid', db.contacts);

/**
* @swagger
* definitions:
*   dataset:
*     properties:
*       Datasets:
*         type: string
*       
*/

/**
 * @swagger
 * /v2/data/dataset:
 *   get:
 *     summary: Dataset information.
 *     description: Returns information about Neotoma dataset
 *     parameters:
 *       - name: datasetid
 *         description: Numeric ID for dataset.
 *         in: path
 *         required: false
 *         type: integer
 *         format: int32
 *       - name: siteid
 *         description: Related site identifier.
 *         in: query
 *         required: false
 *     	   type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
*         description: An array of datasets.
*         schema:
*           type: array
*           items:
*             $ref: '#/definitions/dataset'
*/

router.get('/v2/data/dataset/', db.dataset);
router.get('/v2/data/dataset/:id', db.dataset);
router.get('/v2/data/datasets/:datasetid/publications', db.publicationbydataset);

/**
* @swagger
* definitions:
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

router.get('/v2/data/dbtables/', db.dbtables);
router.get('/v2/data/dbtables/:table', db.dbtables);

/**
* @swagger
* definitions:
*   download:
*     properties:
*       type: object
*/

/**
* @swagger
* /v2/data/download:
*   get:
*     summary: Returns the named Neotoma Database table.
*     description: Returns the named Neotoma Database table.
*     parameters:
*       - name: datasetid
*         description: Table name.
*         in: path
*         required: true
*         type: string
*     produces:
*       - application/json
*     responses:
*       200:
*        description: Returned download object.
*        schema:
*          type: array
*          items:
*            $ref: '#/definitions/download'
*/

router.get('/v2/data/download/', db.download);
router.get('/v2/data/download/:datasetid', db.download);

/**
* @swagger
* definitions:
*   geopolitical:
*     properties:
*       GeoPoliticalID:
*         type: integer
*         format: int32
*       HigherGeoPoliticalID:
*         type: integer
*         format: int32
*       Rank:
*         type: integer
*         format: int32
*       GeoPoliticalUnit:
*         type: string
*       GeoPoliticalName:
*         type: string
*       RecDateCreated: 
*         type: string
*         format: dateTime
*     	RecDateModified:
*     	  type: string
*     	  format: dateTime
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
*       - name: gpid
*         in: query
*         description: Numeric ID for the geopolitical unit.
*         required: false
*         type: integer
*       - name: gpname
*         in: query
*         description: Name of the geopolitical unit.
*         required: false
*         type: string
*       - name: rank
*         in: query
*         description: The unit rank.  Ranges from 1 (country) - 4 (e.g., parks).
*         required: false
*         type: integer
*       - name: lower
*         in: query
*         description: Should all lower ranked units below the target unit be returned?
*         required: false
*         type: boolean  
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

/**
* @swagger
* definitions:
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
* definitions:
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
* definitions:
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

router.get('/v2/data/publications/', db.publicationquery);
router.get('/v2/data/publications/:pubid', db.publicationid);
router.get('/v2/data/sites/:siteid/publications', db.publicationbysite);
router.get('/v2/data/dataset/:datasetid/publications', db.publicationbydataset);

/**
* @swagger
* definitions:
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
 * /v2/data/site:
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

router.get('/v2/data/sites/', db.sitesquery);
router.get('/v2/data/sites/:siteid', db.sitesbyid);
router.get('/v2/data/datasets/:datasetid/site', db.sitesbydataset);
router.get('/v2/data/sites/:siteid/geopoliticalunits', db.geopolbysite);


/**
* @swagger
* definitions:
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
 *       - name: name
 *         description: Taxon name or partial name.
 *         in: query
 *         required: false
 *         type: string
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

router.get('/v2/data/taxa/:taxonid', db.taxonid);
router.get('/v2/data/taxa/', db.taxonquery);


module.exports = router;
