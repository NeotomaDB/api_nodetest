'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/publications/{publicationid}', function () {
  describe('tests for get', function () {
    it('should respond 200 for "A list of publications."', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/publications/{publicationid}', {
        'qs': { 'publicationid': 3837 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
