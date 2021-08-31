'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/contacts', function () {
  describe('tests for get', function () {
    it('should respond 200 for "contact"', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/contacts', {
        'qs': { 'contactid': 27307983, 'familyname': 'esse', 'contactname': 'in veniam', 'contactstatus': 'extant', 'limit': 79898871, 'offset': 38058998 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
