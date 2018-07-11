/*

dbtables.js
By: Michael Stryker
Last Updated: September 14, 2017


 */

var express = require('express');
var router = express.Router();

var handlers = require('../handlers/dbtables_handlers');


/*
router.get('/', function(req, res, next) {
  res.send('NeotomaDB dbtables API: please provide a valid request');
});
*/

//router.get('/RelativeAgeScales', handlers.relativeagescales);
/**
* @swagger
* definitions:
*   dbtables:
*     properties:
*       type: object
*/

/**
* @swagger
* /v1.5/dbtables:
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

router.get('/', handlers.dbtables);
router.get('/:table', handlers.dbtables);


module.exports = router;
