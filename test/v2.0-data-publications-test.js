'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/publications', function () {
  describe('tests for get', function () {
    it('should respond 200 for "A list of publications."', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/publications', {
        'qs': { 'publicationid': 19496, 'datasetid': 92974751, 'siteid': 25707, 'familyname': 'et cupidatat incididunt ut', 'pubtype': 'Other Authored', 'year': 2006, 'search': 'eu eiusmod minim sed ad', 'limit': 10, 'offset': 0 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
