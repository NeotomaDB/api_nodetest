'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/publications', function() {
  describe('tests for get', function() {
    it('should respond 200 for "A list of publications."', function() {
      const response = request('get', 'http://localhost:3001/v2.0/data/publications', {
<<<<<<< HEAD
        'qs': {'publicationid': 6395, 'datasetid': 48044616, 'siteid': 40958, 'familyname': 'w JJ', 'pubtype': 'Journal Article', 'year': 1834, 'search': 'aute minim qui', 'limit': 10, 'offset': 0},
=======
        'qs': {'publicationid': 9634, 'datasetid': 71782836, 'siteid': 43780, 'familyname': 'eiusmod exercitation consectetur veniam incididunt', 'pubtype': 'Master\'s Thesis', 'year': 1538, 'search': 'ad tempor ut adipisicing', 'limit': 10, 'offset': 0},
>>>>>>> production
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
