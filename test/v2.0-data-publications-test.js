'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/publications', function () {
  describe('tests for get', function () {
    it('should respond 200 for "A list of publications."', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/publications', {
        'qs': { 'publicationid': 98523315, 'datasetid': 55954799, 'siteid': 5235, 'familyname': 'pariatur aliquip', 'pubtype': 'Undergraduate thesis', 'year': 1988, 'search': 'non Ut', 'limit': 88376352, 'offset': 85983082 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
