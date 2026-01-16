'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/apps/depenvt', function() {
  describe('tests for get', function() {
    it('should respond 200 for "This returns the information about depositional environment for selected dataset/collection unit/site."', function() {
      const response = request('get', 'http://localhost:3001/v2.0/apps/depenvt', {
        'qs': {'siteid': 25764, 'datasetid': 46176350, 'collectionunitid': 47835},
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
