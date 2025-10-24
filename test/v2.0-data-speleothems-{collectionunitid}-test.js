'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/speleothems/{collectionunitid}', function() {
  describe('tests for get', function() {
    it('should respond 200 for "Metadata associated with speleothems submitted through SISAL."', function() {
      const response = request('get', 'http://localhost:3001/v2.0/data/speleothems/{collectionunitid}', {
        'qs': {'collectionunitid': 55363697},
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
