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
        'qs': {'publicationid': 13569, 'datasetid': 57332750, 'siteid': 7945, 'familyname': 'c', 'pubtype': 'Authored Report', 'year': 1593, 'search': 'sunt tempor laborum', 'limit': 10, 'offset': 0},
=======
        'qs': {'publicationid': 7157, 'datasetid': 51176253, 'siteid': 30018, 'familyname': 'FrBL', 'pubtype': 'Other Authored', 'year': 1679, 'search': 'exercitation consectetur', 'limit': 10, 'offset': 0},
>>>>>>> develop
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
