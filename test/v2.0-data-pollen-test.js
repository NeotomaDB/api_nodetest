'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/pollen', function () {
  describe('tests for get', function () {
    it('should respond 200 for "A record of all pollen samples in time/space for a particular taxon."', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/pollen', {
        'qs': { 'taxonname': 'quis aliqua nostrud amet', 'taxonid': 2799, 'siteid': 23000, 'sitename': 'mollit in sint dolor fugiat', 'datasettype': 'dinoflagellates', 'altmin': 10, 'altmax': 100, 'loc': { 'type': 'FeatureCollection', 'features': [{ 'type': 'Feature', 'properties': {}, 'geometry': { 'coordinates': [[[-73.3, -35.768], [-75.442, -43.787], [-64.059, -43.533], [-53.572, -38.844], [-55.043, -34.302], [-61.15, -33.904], [-68.248, -34.407], [-73.3, -35.768]]], 'type': 'Polygon' } }] }, 'ageof': 22979393, 'ageyoung': 1000, 'ageold': 10000, 'limit': 10, 'offset': 0 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
