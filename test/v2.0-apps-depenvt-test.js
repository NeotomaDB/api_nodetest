'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/apps/depenvt', function() {
  describe('tests for get', function() {
    it('should respond 200 for "This returns the information about depositional environment for selected dataset/collention unit/site."', function() {
      const response = request('get', 'http://localhost:3001/v2.0/apps/depenvt', {
<<<<<<< HEAD
        'qs': {'siteid': 15417, 'datasetid': 13525561, 'collectionunitid': 24821941},
=======
        'qs': {'siteid': 42720, 'datasetid': 31922941, 'collectionunitid': 73318425},
>>>>>>> production
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
