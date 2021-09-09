'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/publications', function () {
  describe('tests for get', function () {
    it('should respond 200 for "A list of publications."', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/publications', {
        'qs': { 'publicationid': 90783049, 'datasetid': 84908554, 'siteid': 3300, 'familyname': 'magna eu anim', 'pubtype': 'Doctoral Dissertation', 'year': 1530, 'search': 'cillum amet et', 'limit': 61631318, 'offset': 58750716 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
