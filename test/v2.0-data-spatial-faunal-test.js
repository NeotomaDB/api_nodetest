'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/spatial/faunal', function() {
  describe('tests for get', function() {
    it('should respond 200 for "An object containing all matched species names, identifiers and a GeoJSON polygon representing the UNIONed ranges for the selected species. All data is derived from:<br> * Mammal Diversity Database. (2020). Mammal Diversity Database (Version 1.2) [Data set]. Zenodo. DOI: [10.5281/zenodo.4139818](https://doi.org/10.5281/zenodo.4139818).<br> * Map of Life. (2021). Mammal range maps harmonised to the Mammals Diversity Database [Data set]. Map of Life. [10.48600/MOL-48VZ-P413](https://doi.org/10.48600/MOL-48VZ-P413) "', function() {
      const response = request('get', 'http://localhost:3001/v2.0/data/spatial/faunal', {
        'qs': {'sciname': 'elit ipsum pariatur non officia', 'proj': 16844513, 'prec': -69746118.85441253},
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
