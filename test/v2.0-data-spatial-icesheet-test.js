'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/spatial/icesheet', function() {
  describe('tests for get', function() {
    it('should respond 200 for "An object containing glacial extents for the selected time period (in **calibrated radiocarbon years**). "', function() {
      const response = request('get', 'http://localhost:3001/v2.0/data/spatial/icesheet', {
<<<<<<< HEAD
        'qs': {'age': 10521, 'proj': 20544, 'prec': 332.37865884380534},
=======
        'qs': {'age': 6842, 'proj': 4326, 'prec': 1000},
>>>>>>> production
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
