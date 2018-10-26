var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000/');

// *************************************************
// Contact Data:
//

describe('Get chronology data by datasetid:', function () {
  // takes a while to run.
  this.timeout(5000);
  it('A call to two datasets returns two datasets of data:', function (done) {
    api.get('v2.0/data/datasets/684,1001/chronology')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return res.body['data'].length === 2;
      })
      .expect(200, done);
  });
});
