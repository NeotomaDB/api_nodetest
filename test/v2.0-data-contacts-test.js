'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/contacts', function() {
  describe('tests for get', function() {
    it('should respond 200 for "contact"', function() {
      const response = request('get', 'http://localhost:3001/v2.0/data/contacts', {
<<<<<<< HEAD
        'qs': {'contactid': 11538, 'familyname': ' K', 'contactname': 'VJHHYW', 'contactstatus': 'defunct', 'limit': 10, 'offset': 0},
=======
        'qs': {'contactid': 1336, 'familyname': 'szq', 'contactname': 'DFvtMz', 'contactstatus': 'deceased', 'limit': 10, 'offset': 0},
>>>>>>> develop
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
