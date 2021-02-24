var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');

const dotenv = require('dotenv');
dotenv.config();

var api = supertest('http://localhost:' + process.env.APIPORT + '/');

describe('Check to see that the vue endpoints run:', function () {
  // takes a while to run.
  it('Hitting the `short` endpoint works:', function (done) {
    api.get('v2.0/data/vueapp/short')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return res.body['message'] === "API is running";
      })
      .expect(200)
      .end(function (err, res) {
        done();
      });
  });
});
