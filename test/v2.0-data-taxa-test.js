'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/taxa', function() {
  describe('tests for get', function() {
    it('should respond 200 for "A taxon or array of taxa."', function() {
      const response = request('get', 'http://localhost:3001/v2.0/data/taxa', {
<<<<<<< HEAD
        'qs': {'taxonname': 'elit commodo mollit do eiusmod', 'taxagroup': 'Excepteur et qui', 'ecolgroup': 'mollit ex tempor id Lorem', 'status': 1, 'limit': 10, 'offset': 0},
=======
        'qs': {'taxonname': 'voluptate dolore id', 'taxagroup': 'ad in', 'ecolgroup': 'est id Duis ullamco dolore', 'status': false, 'limit': 10, 'offset': 0},
>>>>>>> production
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
