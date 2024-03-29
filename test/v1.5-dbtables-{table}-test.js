'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v1.5/dbtables/{table}', function() {
  describe('tests for get', function() {
    it('should respond 200 for "Returned table."', function() {
      const response = request('get', 'http://localhost:3001/v1.5/dbtables/geochrontypes', {
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
