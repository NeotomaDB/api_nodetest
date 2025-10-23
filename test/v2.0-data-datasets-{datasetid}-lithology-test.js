'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/datasets/{datasetid}/lithology', function() {
  describe('tests for get', function() {
    it('should respond 200 for "Lithology"', function() {
<<<<<<< HEAD
      const response = request('get', 'http://localhost:3001/v2.0/data/datasets/3487/lithology', {
=======
      const response = request('get', 'http://localhost:3001/v2.0/data/datasets/500/lithology', {
>>>>>>> develop
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
