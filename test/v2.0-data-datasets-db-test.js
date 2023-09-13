'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/datasets/db', function () {
  describe('tests for get', function () {
    it('should respond 200 for "Datasets"', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/datasets/db', {
        'qs': { 'limit': 10, 'offset': 0, 'database': 'Neotoma' },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
