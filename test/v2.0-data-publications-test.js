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
        'qs': {'publicationid': 17707, 'datasetid': 1620567, 'siteid': 38529, 'familyname': 'rxhPHz', 'pubtype': 'Edited Book', 'year': 1924, 'search': 'sit voluptate eiusmod occaecat Excepteur', 'limit': 10, 'offset': 0},
=======
        'qs': {'publicationid': 7903, 'datasetid': 74129628, 'siteid': 20954, 'familyname': 'mtE c', 'pubtype': 'Edited Book', 'year': 1742, 'search': 'in reprehenderit exercitation', 'limit': 10, 'offset': 0},
>>>>>>> develop
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
