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
        'qs': {'publicationid': 4787, 'datasetid': 50854860, 'siteid': 6178, 'familyname': 'IUysOL', 'pubtype': 'Book Chapter', 'year': 1614, 'search': 'culpa', 'limit': 10, 'offset': 0},
=======
        'qs': {'publicationid': 17707, 'datasetid': 1620567, 'siteid': 38529, 'familyname': 'rxhPHz', 'pubtype': 'Edited Book', 'year': 1924, 'search': 'sit voluptate eiusmod occaecat Excepteur', 'limit': 10, 'offset': 0},
>>>>>>> production
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
