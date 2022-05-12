'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/datasets_elc/{datasetid}', function () {
  describe('tests for get', function () {
    it('should respond 200 for "A Neotoma datasets object suitable for the EarthLife Consortium API."', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/datasets_elc/4935', {
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
