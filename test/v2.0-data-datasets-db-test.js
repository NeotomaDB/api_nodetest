'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/datasets/db', function() {
  describe('tests for get', function() {
    it('should respond 200 for "Datasets"', function() {
      const response = request('get', 'http://neotomaapi-env.eba-wd29jtvf.us-east-2.elasticbeanstalk.com/v2.0/data/datasets/db', {
        'qs': {'limit': 10, 'offset': 0, 'database': 'Neotoma Charcoal Data'},
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
