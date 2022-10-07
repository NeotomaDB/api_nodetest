'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/contacts/{contactid}', function () {
  describe('tests for get', function () {
    it('should respond 200 for "A Neotoma contacts object."', function () {
      var response = request('get', 'http://api-dev.neotomadb.org/v2.0/data/contacts/7155', {
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
