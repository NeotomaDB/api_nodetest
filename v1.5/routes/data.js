'use strict';
/*

data.js
By: Simon Goring
Last Updated: September 14, 2017
Updated by: Michael Stryker


 */

const express = require('express');
const router = express.Router();

const handlers = require('../handlers/data_handlers');

router.get('/', function(req, res, next) {
  res.redirect('/api-docs');
});

router.get('/chronologies/:id', handlers.chronology);
router.get('/contacts/', handlers.contactquery);
router.get('/contacts/:contactid', handlers.contactsbyid);

router.get('/datasets/:datasetid', handlers.datasets);
router.get('/datasets', handlers.datasets);
router.get('/datasets/:datasetid/publications', handlers.publicationbydataset);

router.get('/downloads/', handlers.downloads);
router.get('/downloads/:datasetid', handlers.downloads);

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
* /v1.5/data/geopoliticalunits:
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


router.get('/geopoliticalunits/', handlers.geopoliticalunits);
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
* /v1.5/data/occurrence:
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
router.get('/occurrence/:occurrenceid', handlers.occurrencebyid);
router.get('/taxa/:taxonid/occurrence', handlers.occurrencebytaxon);

/**
* @swagger
* /v1.5/data/taxa:
*   get:
*     summary: Individual taxa records.
*     description: Returns of taxa matching parameters for taxagroupid and taxonname.
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
 * /v1.5/data/pollen:
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
 * /v1.5/data/publications:
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
 *         type: integer
 *         format: int32
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
 * /v1.5/data/sites:
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
 *         type: integer
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
 * /v1.5/data/taxa:
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
 *         type: integer
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
 * /v1.5/data/occurrence:
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

// router for xml endpoint to feed recent uploads widget on website
router.get('/recentuploads/:months', handlers.recentuploadsquery);

module.exports = router;
