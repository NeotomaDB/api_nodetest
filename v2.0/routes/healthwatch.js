/*

healthwatch.js
By: Simon Goring
Last Updated: September 14, 2017

 */
'use strict';

const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.status(200).json({'response': 'Okay'});
});

module.exports = router;
