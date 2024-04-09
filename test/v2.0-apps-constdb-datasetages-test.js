'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/apps/constdb/datasetages', function() {
  describe('tests for get', function() {
    it('should respond 200 for "Returns an ordered array (from earliest to latest) of upload counts by month (YYYY/MM/DD; all days as 01). Months with no uploads are excluded. "', function() {
      const response = request('get', 'http://localhost:3001/v2.0/apps/constdb/datasetages', {
        'qs': {'dbid': 33840670},
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });


    it('should respond 500 for "Error messages for the API are generally standardized across all models. "', function() {
      const response = request('get', 'http://localhost:3001/v2.0/apps/constdb/datasetages', {
        'qs': {'dbid': -79150519},
        'time': true,
      });

      expect(response).to.have.status(500);
      return chakram.wait();
    });
  });
});
