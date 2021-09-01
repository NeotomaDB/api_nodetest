'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/dbtables', function () {
  describe('tests for get', function () {
    it('should respond 200 for "Returned table."', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/dbtables', {
        'qs': { 'table': 'in enim minim', 'limit': 89773212, 'offset': 37903628 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
