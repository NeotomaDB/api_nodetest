'use strict';
/*

apps.js
By: Michael Stryker
Last Updated: September 13, 2017


 */

const express = require('express');
const router = express.Router();

const handlers = require('../handlers/apps_handlers');


router.get('/', function(req, res, next) {
  res.send('NeotomaDB apps API: please provide a valid request');
});


// https://api.neotomadb.org/v1/apps/collectionTypes?callback=dojo_request_script_callbacks.dojo_request_script8


/**
* @swagger
*  /v1.5/apps/authorpis:
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
*            $ref: '#/definitions/authorpis'
*
*definitions:
*  authorpis:
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
*            contactid:
*              type: integer
*              example: 1752
*            contactname:
*              type: string
*              example: "Aaberg, S. A."
**/
router.get('/authorpis', handlers.authorpis);


/**
* @swagger
*  /v1.5/apps/authors:
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
*            $ref: '#/definitions/authors'
*
*definitions:
*  authors:
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
*            contactid:
*              type: integer
*              example: 3
*            contactname:
*              type: string
*              example: "Ahearn, P. J."
**/
router.get('/authors', handlers.authors);

/**
* @swagger
*  /v1.5/apps/collectionTypes:
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
*            $ref: '#/definitions/collectiontypes'
*
*definitions:
*  collectiontypes:
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
*            colltypeid:
*              type: integer
*              example: 1
*            colltype:
*              type: string
*              example: "Animal midden"
**/
router.get('/collectiontypes', handlers.collectiontypes);

/**
* @swagger
*  /v1.5/apps/datasettypes:
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
*            $ref: '#/definitions/datasettypes'
*
*definitions:
*  datasettypes:
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
*            datasettype:
*              type: string
*              example: "biomarker"
*            datasettypeid:
*              type: integer
*              example: 21
**/
router.get('/datasettypes', handlers.datasettypes);
/**
* @swagger
*  /v1.5/apps/depositionalenvironments/root:
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
*            $ref: '#/definitions/depositionalenvironments'
*
*definitions:
*  depositionalenvironments:
*    type: object
*    properties:
*      success:
*        type: integer
*      status:
*        type: string
*      message:
*        type: string
*      data:
*        type: array
*        items:
*          type: object
*          properties:
*            depenvtid:
*              type: integer
*              example: 20
*            depenvt:
*              type: string
*              example: "Artificial Lake"
**/

router.get('/depositionalenvironments/root', handlers.depositionalenvironments);

/**
* @swagger
*  /v1.5/apps/depositionalenvironments:
*    get:
*      produces:
*        - application/json
*      parameters:
*      - in: path
*        required: true
*        type: integer
*        name: id
*        description: "depositional environment id"
*      - name: "callback"
*        in: "query"
*        description: "jsonp callback function"
*        required: false
*        type: "string"
*      responses:
*        '200':
*          description: Definition generated from Swagger Inspector
*          schema:
*            $ref: '#/definitions/depositionalenvironments'
*
*definitions:
*  depositionalenvironments:
*    type: object
*    properties:
*      success:
*        type: integer
*      status:
*        type: string
*      message:
*        type: string
*      data:
*        type: array
*        items:
*          type: object
*          properties:
*            depenvtid:
*              type: integer
*              example: 20
*            depenvt:
*              type: string
*              example: "Artificial Lake"
**/

router.get('/depositionalenvironments/:id',
    handlers.depositionalenvironmentsbyid);

// http://localhost:3010/v1.5/apps/ElementTypes?taxagroupid=VPL&callback=dojo_request_script_callbacks.dojo_request_script14
/**
* @swagger
*  /v1.5/apps/elementtypes:
*    get:
*      produces:
*        - application/json
*      parameters:
*      - name: "callback"
*        in: "query"
*        description: "jsonp callback function"
*        required: false
*        type: "string"
*      - name: "taxagroupid"
*        in: "query"
*        description: "taxagroup id string value"
*        required: false
*        type: "string"
*        example: "VPL"
*      - name: "taxonid"
*        in: "query"
*        description: "taxon id string value"
*        required: false
*        type: "integer"
*        example: 1
*      responses:
*        '200':
*          description: Definition generated from Swagger Inspector
*          schema:
*            $ref: '#/definitions/elementtypes'
*
*definitions:
*  elementtypes:
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
*            elementtypeid:
*              type: integer
*              example: 467
*            elementtype:
*              type: string
*              example: "aboveground parts"
**/
router.get('/elementtypes', handlers.elementtypes);


router.get('/geochronologies', handlers.geochronologies);


/**
* @swagger
*  /v1.5/apps/DatasetTypes:
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
**/
router.get('/TaxaInDatasets', handlers.taxaindatasets);

router.get('/TaxaGroupTypes', handlers.taxagrouptypes);

router.get('/keywords', handlers.keywords);

router.get('/TaphonomySystems', handlers.taphonomysystems);

/**
* @swagger
*  /v1.5/apps/RelativeAges:
*    get:
*      produces:
*        application/json
*      parameters:
*       - name: "callback"
*         in: "query"
*         type: "string"
*         required: false
*         description: "jsonp callback function"
*       - name: "agescaleid"
*         in: "query"
*         type: integer
*         format: int32
*         required: true
*         description: "Numeric ID for age scale."
*      responses:
*         '200':
*           description: Definition generated from Swagger Inspector
*           schema:
*             $ref: '#/definitions/relativeAge'
*
*definitions:
*  relativeAge:
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
*            relativeageid:
*              type: integer
*            relativeageunitid:
*              type: integer
*            relativeagescaleid:
*              type: integer
*            relativeage:
*              type: string
*            c14ageyounger:
*              type: number
*            c14ageolder:
*              type: number
*            calageyounger:
*              type: number
*            calageolder:
*              type: number
*            notes:
*              type: string
*            recdatecreated:
*              type: string
*            recdatemodified:
*              type: string
**/
router.get('/relativeages', handlers.relativeages);

router.get('/search', handlers.search);

module.exports = router;
