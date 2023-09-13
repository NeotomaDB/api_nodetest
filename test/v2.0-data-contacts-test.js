'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/contacts', function () {
  describe('tests for get', function () {
    it('should respond 200 for "contact"', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/contacts', {
        'qs': { 'contactid': 5557, 'familyname': 'id ut consequat ipsum sit', 'contactname': 'ad', 'contactstatus': 'extant', 'limit': 10, 'offset': 0 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
