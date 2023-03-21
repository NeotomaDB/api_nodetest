'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/publications', function () {
  describe('tests for get', function () {
    it('should respond 200 for "A list of publications."', function () {
      var response = request('get', 'http://api.neotomadb.org/v2.0/data/publications', {
        'qs': { 'publicationid': 16991, 'datasetid': 45823536, 'siteid': 19954, 'familyname': 'culpa sed cillum deserunt Ut', 'pubtype': "Master's Thesis", 'year': 1914, 'search': 'eiusmod ullamco', 'limit': 10, 'offset': 0 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
