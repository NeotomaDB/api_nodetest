'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/apps/constdb/datasets', function() {
  describe('tests for get', function() {
    it('should respond 200 for "Returns the set of datasets contained within a constituent database, identified by the constituent database identifier. Used for quick landing page generation. "', function() {
      const response = request('get', 'http://localhost:3001/v2.0/apps/constdb/datasets', {
        'qs': {'dbid': 1},
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
