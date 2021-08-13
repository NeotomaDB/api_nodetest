'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/publications', function () {
  describe('tests for get', function () {
    it('should respond 200 for "A list of publications."', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/publications', {
        'qs': { 'publicationid': 91280618, 'datasetid': 94909622, 'siteid': 25147, 'familyname': 'occaecat aliquip', 'pubtype': 'Authored Report', 'year': 1846, 'search': 'officia ullamco dolore Ut', 'limit': 20482348, 'offset': 73776594 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
