'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/contacts/{contactid}', function() {
  describe('tests for get', function() {
    it('should respond 200 for "A Neotoma contacts object."', function() {
      const response = request('get', 'http://localhost:3001/v2.0/data/contacts/6207', {
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
