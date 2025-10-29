'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/publications', function() {
  describe('tests for get', function() {
    it('should respond 200 for "A list of publications."', function() {
      const response = request('get', 'http://localhost:3001/v2.0/data/publications', {
        'qs': {'publicationid': 9389, 'datasetid': 48964004, 'siteid': 41482, 'familyname': 's', 'pubtype': 'Book Chapter', 'year': 1958, 'search': 'do proident in', 'limit': 10, 'offset': 0},
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
