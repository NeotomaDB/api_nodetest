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
        'qs': {'publicationid': 16468, 'datasetid': 77535905, 'siteid': 32278, 'familyname': 'oTpfAErfsdi', 'pubtype': 'Book Chapter', 'year': 1999, 'search': 'laborum in commodo veniam', 'limit': 10, 'offset': 0},
=======
        'qs': {'publicationid': 10650, 'datasetid': 30281307, 'siteid': 37166, 'familyname': 'hUOkk', 'pubtype': 'Authored Report', 'year': 1682, 'search': 'in Ut', 'limit': 10, 'offset': 0},
>>>>>>> develop
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
