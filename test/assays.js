'use strict';
const expect = require('chai').expect;
const supertest = require('supertest');

const dotenv = require('dotenv');
dotenv.config();

let testroute = process.env.APIPORT;

if (typeof process.env.APIPATH === 'undefined') {
  testroute = 'http://localhost:' + process.env.APIPORT + '/';
} else {
  testroute = process.env.APIPATH;
}

const api = supertest(testroute);

// *************************************************
// aeDNA assay data:
//
// This lives outside test/v*.js on purpose: genoatt.sh deletes and regenerates
// those from openapi.yaml, and the generated tests only ever assert a status
// code. The assay payload feeds the FAIRe exporter's projectMetadata sheet, so
// a field silently dropped from assaysbydataset.sql would surface there as a
// blank cell rather than as a failure.

describe('Get aeDNA assays by datasetid:', function() {
  this.timeout(5000);

  it('every assay carries the FAIRe project terms:', function(done) {
    api.get('v2.0/data/datasets/74666/assays')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(function(res) {
        const assays = res.body.data.assays;
        expect(assays).to.be.an('array');
        assays.forEach(function(assay) {
          // sterilise_method / neg_cont / pos_cont -> projectMetadata D6/D7/D8.
          expect(assay).to.have.property('sterilisemethod');
          expect(assay).to.have.property('negcont');
          expect(assay).to.have.property('poscont');
        });
      })
      .end(done);
  });

  it('a dataset with no assays returns an empty array, not an error:', function(done) {
    api.get('v2.0/data/datasets/500/assays')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(function(res) {
        expect(res.body.data.assays).to.be.an('array');
      })
      .end(done);
  });
});
