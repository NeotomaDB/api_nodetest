'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/occurrences', function () {
  describe('tests for get', function () {
    it('should respond 200 for "occurrence"', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/occurrences', {
        'qs': { 'taxonname': 'commodo Duis in incididunt', 'taxonid': 11191, 'siteid': 3806, 'sitename': 'qui sint sed', 'datasettype': 'macroinvertebrate', 'altmin': 10, 'altmax': 100, 'loc': { 'type': 'FeatureCollection', 'features': [{ 'type': 'Feature', 'properties': {}, 'geometry': { 'coordinates': [[[-73.3, -35.768], [-75.442, -43.787], [-64.059, -43.533], [-53.572, -38.844], [-55.043, -34.302], [-61.15, -33.904], [-68.248, -34.407], [-73.3, -35.768]]], 'type': 'Polygon' } }] }, 'ageof': 2199402, 'ageyoung': 1000, 'ageold': 10000, 'limit': 10, 'offset': 0 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
