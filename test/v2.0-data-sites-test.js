'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/sites', function () {
  describe('tests for get', function () {
    it('should respond 200 for "An array of sites."', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/sites', {
        'qs': { 'sitename': 'in amet consectetur et', 'database': 'Deep-Time Palynology Database', 'datasettype': 'dinoflagellates', 'altmin': 10, 'altmax': 100, 'loc': { 'type': 'FeatureCollection', 'features': [{ 'type': 'Feature', 'properties': {}, 'geometry': { 'coordinates': [[[-73.3, -35.768], [-75.442, -43.787], [-64.059, -43.533], [-53.572, -38.844], [-55.043, -34.302], [-61.15, -33.904], [-68.248, -34.407], [-73.3, -35.768]]], 'type': 'Polygon' } }] }, 'siteid': 21739, 'datasetid': 14795405, 'doi': '10<6529587//VS', 'gpid': 'Canada', 'keyword': 'bottom', 'contactid': 18696, 'taxa': 'sunt laborum anim veniam', 'ageyoung': 1000, 'ageold': 10000, 'ageof': 1515991, 'limit': 10, 'offset': 0 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
