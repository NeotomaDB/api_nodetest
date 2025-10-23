'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/dbtables/{table}', function() {
  describe('tests for get', function() {
    it('should respond 200 for "Returned table."', function() {
<<<<<<< HEAD
      const response = request('get', 'http://localhost:3001/v2.0/data/dbtables/exercitationculpaconsectetur', {
        'qs': {'count': true, 'limit': 10, 'offset': 0},
=======
      const response = request('get', 'http://localhost:3001/v2.0/data/dbtables/essecupidatatsuntet', {
        'qs': {'count': false, 'limit': 10, 'offset': 0},
>>>>>>> production
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
