'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/apps/constdb', function() {
  describe('tests for get', function() {
    it('should respond 200 for "Returns metadata about each constituent database in Neotoma, including Summary Informationrmation about dataset types within the database and the age spans of the records in the database. "', function() {
      const response = request('get', 'http://localhost:3001/v2.0/apps/constdb', {
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });


    it('should respond 500 for "Error messages for the API are generally standardized across all models. "', function() {
      const response = request('get', 'http://localhost:3001/v2.0/apps/constdb', {
        'time': true,
      });

      expect(response).to.have.status(500);
      return chakram.wait();
    });
  });
});
