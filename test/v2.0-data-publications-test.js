'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/publications', function () {
  describe('tests for get', function () {
    it('should respond 200 for "A list of publications."', function () {
      var response = request('get', 'http://api-dev.neotomadb.org/v2.0/data/publications', {
        'qs': { 'publicationid': 18565, 'datasetid': 83653178, 'siteid': 12514, 'familyname': 'magna esse exercitation', 'pubtype': 'Undergraduate thesis', 'year': 1773, 'search': 'irure aliquip', 'limit': 10, 'offset': 0 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
