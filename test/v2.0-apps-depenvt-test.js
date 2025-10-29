'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/apps/depenvt', function() {
  describe('tests for get', function() {
    it('should respond 200 for "This returns the information about depositional environment for selected dataset/collention unit/site."', function() {
      const response = request('get', 'http://localhost:3001/v2.0/apps/depenvt', {
        'qs': {'siteid': 17023, 'datasetid': 80937134, 'collectionunitid': 44813656},
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
