/*

data.js
By: Simon Goring
Last Updated: October 10, 2017
Updated by: Michael Stryker

 */

var express = require('express');
var router = express.Router();

var handlers = require('../handlers/data_handlers');

router.get('/', function(req, res, next) {
  res.redirect('/api-docs');
});

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
*       contactid:
*         type: integer
*         format: int64
*         example: 123
*       contactname:
*         type: string
*         example: Simon J Goring
*       lastname:
*         type: string
*         example: Goring
*       firstname:
*         type: string
*         example: Simon
*       status:
*         type: string
*         example: Active
*       address:
*         type: string
*         example: 550 N Park St, Madison WI, USA
*       url:
*         type: string
*         example: http://goring.org
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
* /contacts:
*   get:
*     summary: Contact information for Neotoma contributors.
*     description: Returns researcher contact information associated with a record.
*     parameters:
*       - name: contactid
*         description: Unique contact identifier.
*         in: path
*         required: false
*         type: integer
*         format: int64
*       - name: lastname
*         description: Last name of the researcher
*         in: query
*         required: false
*         type: string
*       - name: contactname
*         description: Full name of the the researcher (may use wildcards)
*         in: query
*         required: false
*         type: string
*         example: \*Goring\*
*       - name: status
*         in: query
*         description: Current employment status
*         type: string
*         enum: ["active","deceased", "defunct", "extant", "inactive", "retired", "unknown"]
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
router.get('/contacts/', handlers.contactquery);
router.get('/contacts/:contactid', handlers.contactsbyid);

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

router.get('/datasets/', handlers.datasetquery);
router.get('/datasets/:datasetid', handlers.datasetbyid);
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
*       occurrence:
*         type: integer
*         format: int64
*       sample:
*         type: integer
*         format: int64
*       taxon:
*         type: object
*         properties:
*           taxonid:
*             type: integer
*             format: int64
*           taxonname:
*             type: string
*       ages:
*         type: object
*         properties:
*           age:
*             type: integer
*             format: int64
*           ageolder:
*             type: integer
*             format: int64
*           ageyounger:
*             type: integer
*             format: int64
*       site:
*         type: object
*         properties:
*           datasetid:
*             type: integer
*             format: int64
*           siteid:
*             type: integer
*             format: int64
*           sitename:
*             type: string
*             altitude: int32
*           location:
*             type: string
*           datasettype:
*             type: string
*           database:
*             type: string
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
*         required: false
*         type: integer
*       - name: taxonname
*         description: Name of the taxon for which occurrences are requested.
*         in: query
*         required: false
*         type: string
*       - name: taxonid
*         description: Unique taxonomic identifier (from the Neotoma taxon table).
*         in: query
*         required: false
*         type: integer
*       - name: siteid
*         description: The unique site identifier (from the Neotoma sites table).
*         in: query
*         required: false
*         type: integer
*       - name: sitename
*         description: Site name for the record.
*         in: query
*         required: false
*         type: string
*       - name: datasettype
*         description: Neotoma contains data for a number of dataset types.  This returns a subset of data types.
*         in: query
*         required: false
*         type: string
*       - name: altmin
*         description: Lower altitude boundary for occurrence searches.
*         in: query
*         required: false
*         type: integer
*         format: int32
*       - name: altmax
*         description: Upper altitude boundary for occurrence searches.
*         in: query
*         required: false
*         type: integer
*         format: int32
*       - name: loc
*         description: geoJSON string for search boundaries.
*         in: query
*         required: false
*         type: string
*       - name: age
*         description: A single age for a search
*         in: query
*         required: false
*         type: integer
*       - name: ageyounger
*         description: The most recent age for occurrences within a query.
*         in: query
*         required: false
*         type: integer
*         format: int64
*       - name: ageolder
*         description: The oldest age for occurrences to be returned by the query.
*         in: query
*         required: false
*         type: integer
*         format: int64
*       - name: limit
*         description: The maximum number of records to be returned, default is 25.
*         type: integer
*         format: int32
*         in: query
*         required: false
*       - name: offset
*         description: The offset for returned records.  Default is 0.
*         in: query
*         required: false
*         type: integer
*         format: int32
*     produces:
*       - application/json
*     responses:
*       200:
*        description: occurrence
*        schema:
*          type: object
*          items:
*            $ref: '#/definitions/occurrence'
*/

router.get('/occurrence/', handlers.occurrencequery);
router.get('/occurrence/:occurrenceid', handlers.occurrencebyid);
router.get('/taxa/:taxonid/occurrence', handlers.occurrencebytaxon);

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

router.get('/taxa/:taxonid', handlers.taxonbyid);
router.get('/taxa/', handlers.taxonquery);

module.exports = router;
