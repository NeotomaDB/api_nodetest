'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/publications', function () {
  describe('tests for get', function () {
    it('should respond 200 for "A list of publications."', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/publications', {
        'qs': { 'publicationid': 3696700, 'datasetid': 20407579, 'siteid': 4983, 'familyname': 'in id enim dolore veniam', 'pubtype': 'Authored Book', 'year': 1629, 'search': 'consequat exercitation ullamco consectetur', 'limit': 95623353, 'offset': 77433200 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
