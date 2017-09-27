/*

data.js
By: Simon Goring
Last Updated: September 14, 2017
Updated by: Michael Stryker


 */

var express = require('express');
var router = express.Router();

var handlers = require('../handlers/data_handlers');

router.get('/', function(req, res, next) {
  res.redirect('/api-docs');

  /* res.send('NeotomaDB data API: please provide a valid request'); */
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
* /chronology:
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
router.get('/chronology', handlers.chronology);
router.get('/chronology/:id', handlers.chronology);

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
* /contacts:
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
router.get('/contacts/', handlers.contacts);
router.get('/contacts/:contactid', handlers.contacts);

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
 * /dataset:
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

router.get('/dataset/', handlers.dataset);
router.get('/dataset/:id', handlers.dataset);
router.get('/datasets/:datasetid/publications', handlers.publicationbydataset);

/**
* @swagger
* definitions:
*   dbtables:
*     properties:
*       type: object
*/

/**
* @swagger
* /dbtables:
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

router.get('/dbtables/', handlers.dbtables);
router.get('/dbtables/:table', handlers.dbtables);

/**
* @swagger
* definitions:
*   download:
*     properties:
*       type: object
*/

/**
* @swagger
* /download:
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

router.get('/download/', handlers.download);
router.get('/download/:datasetid', handlers.download);

/**
* @swagger
* definitions:
*   geopolitical:
*     properties:
*       geopoliticalid:
*         example: 757
*         type: integer
*         format: int32
*       highergeopoliticalid:
*         type: integer
*         format: int32
*         example: 756
*       rank:
*         type: integer
*         format: int32
*         example: 2
*       geopoliticalunit:
*         type: string
*         example: Alberta
*       geopoliticalname:
*         type: string
*         example: province
*       recdatecreated: 
*         type: string
*         format: dateTime
*         example: 2013-09-30T21:02:51.000Z
*       recdatemodified:
*         type: string
*         format: dateTime
*         example: 2013-09-30T21:02:51.000Z
*/

/**
* @swagger
* /geopoliticalunits:
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


router.get('/geopoliticalunits', handlers.geopoliticalunits);
router.get('/geopoliticalunits/:gpid', handlers.geopoliticalbyid);
router.get('/sites/:siteid/geopoliticalunits', handlers.geopolbysite);

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
* /occurrence:
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

router.get('/occurrence/', handlers.occurrencequery);
router.get('/occurrence/:id', handlers.occurrencequery);

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
 * /pollen:
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

router.get('/pollen/', handlers.pollen);
router.get('/pollen/:id', handlers.pollen);


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
 * /publication:
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

router.get('/publications/', handlers.publicationquery);
router.get('/publications/:pubid', handlers.publicationid);
router.get('/sites/:siteid/publications', handlers.publicationbysite);
router.get('/dataset/:datasetid/publications', handlers.publicationbydataset);

/**
* @swagger
* definitions:
*   sites:
*     properties:
*       siteid:
*         type: integer
*         format: int64
*       sitename:
*         type: string
*       sitedescription:
*         type: string
*       geography:
*         type: string
*       altitude:
*         type: float
*       CollectionUnits:
*         type: object
*         properties:
*           collectionunit:
*             type: string
*           collectionunitid:
*             type: integer
*             format:  int64
*           handle:
*             type: string
*           collectionunittype:
*             type: string
*           datasets:
*             type: object
*             properties:
*               datasettype:
*                 type: string
*               datasetid:
*                 type: integer
*                 format: int64
*/

/**
 * @swagger
 * /sites:
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

router.get('/sites/', handlers.sitesquery); // Goes to the queries.
router.get('/sites/:siteid', handlers.sitesbyid); // Takes integers, including comma separated
router.get('/datasets/:datasetid/sites', handlers.sitesbydataset); // Takes a dataset ID.
//router.get('/publications/:pubid/site', handlers.sitesbypublication);
router.get('/geopoliticalunits/:gpid/sites', handlers.sitesbygeopol);
//router.get('/contacts/:contactid/site', handlers.sitesbycontacts);

/**
* @swagger
* definitions:
*   taxa:
*     properties:
*       taxonid:
*         type: integer
*         format: int32
*       taxonname:
*         type: string
*       author:
*         type: string
*       ecolgroup:
*         type: array
*       highertaxonid:
*         type: integer
*         format: int32
*       publicationid:
*         type: integer
*         format: int32
*       status:
*         type: boolean
*/

/**
 * @swagger
 * /taxa:
 *   get:
 *     summary: Taxonomic information.
 *     description: Returns information about a taxon and (if requested) related taxa.
 *     parameters:
 *       - name: taxonid
 *         description: Numeric ID for taxa.
 *         in: path
 *         required: false
 *         type: integer
 *       - name: taxonname
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

router.get('/taxa/:taxonid', handlers.taxonid);
router.get('/taxa/', handlers.taxonquery);

/**
* @swagger
* definitions:
*   occurrence:
*     properties:
*       sampleid:
*         type: integer
*         format: int32
*       taxon:
*         type: object
*         properties:
*           taxonid:
*             type: integer
*             format: int32
*           taxonname:
*             type: string
*       ages:
*         type: object
*         properties:
*           age:
*             type: integer
*             format: int32
*           ageolder:
*             type: integer
*             format: int32
*           ageyounger:
*             type: integer
*             format: int32
*       site:
*         type: object
*         properties:
*           datasetid:
*             type: integer
*             format: int32
*           siteid:
*             type: integer
*             format: int32
*           sitename:
*             type: string
*           altitude:
*             type: integer
*             format: int32
*           location:
*           datasettype:
*             type: string
*           database:
*             type: string
*/

/**
 * @swagger
 * /occurrence:
 *   get:
 *     summary: Occurrence information for a taxon and sample.
 *     description: Given a set of query parameters, return individual occurrence information for a particular sample.
 *     parameters:
 *       - name: taxonid
 *         description: Numeric ID for taxa.
 *         in: path
 *         required: false
 *         type: integer
 *       - name: taxonname
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
 *         type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
*         description: A taxon or array of taxa.
*         schema:
*           type: array
*           items:
*             $ref: '#/definitions/occurrence'
*/

router.get('/occurrence/', handlers.occurrencequery);
router.get('/taxa/:taxonid/occurrence/', handlers.occurrencebytaxon);

module.exports = router;
