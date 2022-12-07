'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/datasets', function () {
  describe('tests for get', function () {
    it('should respond 200 for "An array of datasets."', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/datasets', {
        'qs': { 'sitename': 'nisi exercitation sit officia Excepteur', 'database': 'North American Plant Macrofossil Database', 'datasettype': 'X-ray fluorescence (XRF)', 'altmin': 10, 'altmax': 100, 'loc': { 'type': 'FeatureCollection', 'features': [{ 'type': 'Feature', 'properties': {}, 'geometry': { 'coordinates': [[[-73.3, -35.768], [-75.442, -43.787], [-64.059, -43.533], [-53.572, -38.844], [-55.043, -34.302], [-61.15, -33.904], [-68.248, -34.407], [-73.3, -35.768]]], 'type': 'Polygon' } }] }, 'siteid': 9755, 'datasetid': 49392740, 'doi': '10F13949973/WH8W7', 'gpid': 'Canada', 'keyword': 'beyond radiocarbon', 'contactid': 11638, 'taxa': 'sint reprehenderit labore occaecat', 'ageyoung': 1000, 'ageold': 10000, 'ageof': 23647832, 'limit': 10, 'offset': 0 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
