'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/publications', function() {
  describe('tests for get', function() {
    it('should respond 200 for "A list of publications."', function() {
      const response = request('get', 'http://localhost:3001/v2.0/data/publications', {
        'qs': {'publicationid': 15306, 'datasetid': 66384220, 'siteid': 3806, 'familyname': '%tTmM', 'pubtype': 'Edited Report', 'year': 1771, 'search': 'non mollit nisi', 'limit': 10, 'offset': 0},
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
