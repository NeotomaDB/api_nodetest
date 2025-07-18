'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/apps/constdb/datasetuploads', function() {
  describe('tests for get', function() {
    it('should respond 200 for "Returns an ordered array (from earliest to latest) of upload counts by month (YYYY/MM/DD; all days as 01). Months with no uploads are excluded. "', function() {
      const response = request('get', 'http://localhost:3001/v2.0/apps/constdb/datasetuploads', {
        'qs': {'dbid': 4},
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
