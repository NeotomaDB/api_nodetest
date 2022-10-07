'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/publications', function () {
  describe('tests for get', function () {
    it('should respond 200 for "A list of publications."', function () {
      var response = request('get', 'http://api-dev.neotomadb.org/v2.0/data/publications', {
        'qs': { 'publicationid': 12321, 'datasetid': 68096667, 'siteid': 9564, 'familyname': 'nisi', 'pubtype': 'Authored Report', 'year': 1890, 'search': 'deserunt', 'limit': 10, 'offset': 0 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
