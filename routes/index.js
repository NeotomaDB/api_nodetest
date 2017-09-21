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

/**
* @swagger
* definitions:
*   contact:
*     properties:
*       contactid:
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
*       type: object
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
router.get('/v2/data/dataset/:datasetid', db.datasetbyid);
router.get('/v2/data/sites/:siteid/datasets', db.datasetbysiteid);

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
*   geopolitical:
*     properties:
*       geopoliticalid:
*         type: integer
*         format: int32
*       geopoliticalname:
*         type: string
*       geopoliticalunit:
*         type: string
*       rank:
*         type: integer
*         format: int32
*       highergeopoliticalid:
*         type: integer
*         format: int32
*       recdatecreated: 
*         type: string
*         format: date-time
*     	recdatemodified:
*         type: string
*         format: date-time
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
router.get('/v2/data/geopoliticalunits/:gpid', db.geopoliticalbyid);

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
 * /v2/data/sites:
 *   get:
 *     summary: Site information.
 *     description: Returns information about Neotoma sites
 *     parameters:
 *       - name: siteid
 *         description: Numeric ID for publications.
 *         in: path
 *         required: false
 *         type: integer
 *       - name: datasetid
 *         description: Related dataset identifier.
 *         in: query
 *         required: false
 *         type: integer
 *       - name: site
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
*       collectionunits:
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

router.get('/v2/data/sites/', db.sitesquery); // Goes to the queries.
router.get('/v2/data/sites/:siteid', db.sitesbyid); // Takes integers, including comma separated
router.get('/v2/data/dataset/:datasetid/sites', db.sitesbydataset); // Takes a dataset ID.
//router.get('/v2/data/publications/:pubid/site', db.sitesbypublication);
router.get('/v2/data/geopoliticalunits/:gpid/sites', db.sitesbygeopol);
//router.get('/v2/data/contacts/:contactid/site', db.sitesbycontacts);

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
 * /v2/data/taxa:
 *   get:
 *     summary: Taxonomic information.
 *     description: Returns information about a taxon and related taxa if requested.
 *     parameters:
 *       - name: taxonid
 *         description: Numeric ID for taxa, or comma separated string.
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

router.get('/v2/data/taxa/:taxonid', db.taxonid);
router.get('/v2/data/taxa/', db.taxonquery);

router.get('/v2/data/occurrence/', db.occurrencequery);

module.exports = router;
