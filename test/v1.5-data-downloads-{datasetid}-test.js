'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v1.5/data/downloads/{datasetid}', function() {
  describe('tests for get', function() {
    it('should respond 200 for "Returned download object."', function() {
      const response = request('get', 'http://localhost:3001/v1.5/data/downloads/2566', {
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
