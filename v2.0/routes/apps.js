/*

apps.js
By: Michael Stryker
Last Updated: September 13, 2017

 */

var express = require('express');

var router = express.Router();

var handlers = require('../handlers/apps_handlers');

router.get('/', function(req, res, next) {
  res.send('NeotomaDB apps API: please provide a valid request');
});

/**
* @swagger
*  /v2.0/apps/collectionTypes:
*    get:
*      produces:
*      - application/json
*      parameters:
*      - name: "callback"
*        in: "query"
*        description: "jsonp callback function"
*        required: false
*        type: "string"
*      responses:
*        200:
*          description: Definition generated from Swagger Inspector
*          schema:
*            $ref: '#/definitions/collectionTypes'
*
* definitions:
*   collectionTypes:
*     type: object
*     properties:
*       status:
*         type: string
*       message:
*         type: string
*       data:
*         type: array
*         items:
*           type: object
*           properties:
*             getcollectiontypes:
*               type: string
*
*/

router.get('/collectionTypes', handlers.collectiontypes);
/**
* @swagger
*  /DatasetTypes:
*    get:
*      produces:
*        - application/json
*      parameters:
*      - name: "callback"
*        in: "query"
*        description: "jsonp callback function"
*        required: false
*        type: "string"
*      responses:
*        '200':
*          description: Definition generated from Swagger Inspector
*          schema:
*            $ref: '#/definitions/datasetTypes'
*
*definitions:
*  datasetTypes:
*    type: object
*    properties:
*      status:
*        type: string
*      message:
*        type: string
*      data:
*        type: array
*        items:
*          type: object
*          properties:
*            getdatasettypes:
*              type: string
*/

router.get('/TaxaInDatasets', handlers.taxaindatasets);

/**
* @swagger
*  /TaxaInDatasets:
*    get:
*      produces:
*        - application/json
*      parameters:
*      - name: "callback"
*        in: "query"
*        description: "jsonp callback function"
*        required: false
*        type: "string"
*      responses:
*        '200':
*          description: Definition generated from Swagger Inspector
*          schema:
*            $ref: '#/definitions/taxaInDatasets'
*
*definitions:
*  taxaInDatasets:
*    type: object
*    properties:
*      status:
*        type: string
*      message:
*        type: string
*      data:
*        type: array
*        items:
*          type: object
*          properties:
*            TaxonName:
*              type: string
*            TaxonID:
*              type: integer
*            TaxonGroupID:
*              type: string
*            DatasetTypeIDs:
*              type: array
*              items:
*                type: integer
*/
router.get('/DatasetTypes', handlers.datasettypes);

router.get('/TaxaGroupTypes', handlers.taxagrouptypes);

router.get('/keywords', handlers.keywords);

router.get('/authorpis', handlers.authorpis);

router.get('/TaphonomySystems', handlers.taphonomysystems);

router.get('/DepositionalEnvironments/root', handlers.depositionalenvironments);



module.exports = router;
