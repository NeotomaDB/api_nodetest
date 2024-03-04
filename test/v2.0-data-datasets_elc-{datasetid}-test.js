'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/datasets_elc/{datasetid}', function() {
  describe('tests for get', function() {
    it('should respond 200 for "A Neotoma datasets object suitable for the EarthLife Consortium API."', function() {
      const response = request('get', 'http://localhost:3001/v2.0/data/datasets_elc/9503', {
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
