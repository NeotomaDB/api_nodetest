var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');

const dotenv = require('dotenv');
dotenv.config();

var api = supertest('http://localhost:' + process.env.APIPORT + '/');
// *************************************************
// Occurrence Data:
//

describe('Get Neotoma data with geoJSON extents:', function () {
  this.timeout(15000);

  it('Get occurrence data using a simple geoJSON:', function (done) {
    api.get('v2.0/data/occurrences?loc={"type":"Polygon","coordinates":[[[-104.053249,41.001406],[-103.497447,41.001635],[-102.865784,41.001988],[-102.556789,41.002219],[-102.051614,41.002377],[-102.051725,40.537839],[-102.051744,40.003078],[-102.050422,39.646048],[-102.048449,39.303138],[-102.045388,38.813392],[-102.045324,38.453647],[-102.044644,38.045532],[-102.041574,37.680436],[-102.041974,37.352613],[-102.04224,36.993083],[-102.698142,36.995149],[-102.814616,37.000783],[-103.002199,37.000104],[-103.733247,36.998016],[-104.338833,36.993535],[-105.000554,36.993264],[-105.1208,36.995428],[-105.62747,36.995679],[-106.201469,36.994122],[-106.869796,36.992426],[-106.877292,37.000139],[-107.420913,37.000005],[-108.000623,37.000001],[-108.249358,36.999015],[-108.620309,36.999287],[-109.045223,36.999084],[-109.04581,37.374993],[-109.041865,37.530726],[-109.041058,37.907236],[-109.041762,38.16469],[-109.060062,38.275489],[-109.059541,38.719888],[-109.054189,38.874984],[-109.051512,39.126095],[-109.051363,39.497674],[-109.050615,39.87497],[-109.050946,40.444368],[-109.048044,40.619231],[-109.050076,41.000659],[-108.884138,41.000094],[-108.250649,41.000114],[-107.625624,41.002124],[-106.857773,41.002663],[-106.453859,41.002057],[-106.217573,40.997734],[-105.730421,40.996886],[-105.277138,40.998173],[-104.855273,40.998048],[-104.675999,41.000957],[-104.053249,41.001406]]]}')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return Object.keys(res.body['data'][0]).length > 0;
      })
      .expect(function (res) {
        return res.body['data'][0]['occurrence'] === 12;
      })
      .expect(200, done);
  });
  it('Get site data using a simple geoJSON:', function (done) {
    api.get('v2.0/data/sites?loc={"type":"Polygon","coordinates":[[[-104.053249,41.001406],[-103.497447,41.001635],[-102.865784,41.001988],[-102.556789,41.002219],[-102.051614,41.002377],[-102.051725,40.537839],[-102.051744,40.003078],[-102.050422,39.646048],[-102.048449,39.303138],[-102.045388,38.813392],[-102.045324,38.453647],[-102.044644,38.045532],[-102.041574,37.680436],[-102.041974,37.352613],[-102.04224,36.993083],[-102.698142,36.995149],[-102.814616,37.000783],[-103.002199,37.000104],[-103.733247,36.998016],[-104.338833,36.993535],[-105.000554,36.993264],[-105.1208,36.995428],[-105.62747,36.995679],[-106.201469,36.994122],[-106.869796,36.992426],[-106.877292,37.000139],[-107.420913,37.000005],[-108.000623,37.000001],[-108.249358,36.999015],[-108.620309,36.999287],[-109.045223,36.999084],[-109.04581,37.374993],[-109.041865,37.530726],[-109.041058,37.907236],[-109.041762,38.16469],[-109.060062,38.275489],[-109.059541,38.719888],[-109.054189,38.874984],[-109.051512,39.126095],[-109.051363,39.497674],[-109.050615,39.87497],[-109.050946,40.444368],[-109.048044,40.619231],[-109.050076,41.000659],[-108.884138,41.000094],[-108.250649,41.000114],[-107.625624,41.002124],[-106.857773,41.002663],[-106.453859,41.002057],[-106.217573,40.997734],[-105.730421,40.996886],[-105.277138,40.998173],[-104.855273,40.998048],[-104.675999,41.000957],[-104.053249,41.001406]]]}')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return Object.keys(res.body['data'][0]).length > 0;
      })
      .expect(function (res) {
        return res.body['data'][0]['occurrence'] === 12;
      })
      .expect(200, done);
  });
  it('Get dataset data using a simple geoJSON:', function (done) {
    api.get('v2.0/data/datasets?loc={"type":"Polygon","coordinates":[[[-104.053249,41.001406],[-103.497447,41.001635],[-102.865784,41.001988],[-102.556789,41.002219],[-102.051614,41.002377],[-102.051725,40.537839],[-102.051744,40.003078],[-102.050422,39.646048],[-102.048449,39.303138],[-102.045388,38.813392],[-102.045324,38.453647],[-102.044644,38.045532],[-102.041574,37.680436],[-102.041974,37.352613],[-102.04224,36.993083],[-102.698142,36.995149],[-102.814616,37.000783],[-103.002199,37.000104],[-103.733247,36.998016],[-104.338833,36.993535],[-105.000554,36.993264],[-105.1208,36.995428],[-105.62747,36.995679],[-106.201469,36.994122],[-106.869796,36.992426],[-106.877292,37.000139],[-107.420913,37.000005],[-108.000623,37.000001],[-108.249358,36.999015],[-108.620309,36.999287],[-109.045223,36.999084],[-109.04581,37.374993],[-109.041865,37.530726],[-109.041058,37.907236],[-109.041762,38.16469],[-109.060062,38.275489],[-109.059541,38.719888],[-109.054189,38.874984],[-109.051512,39.126095],[-109.051363,39.497674],[-109.050615,39.87497],[-109.050946,40.444368],[-109.048044,40.619231],[-109.050076,41.000659],[-108.884138,41.000094],[-108.250649,41.000114],[-107.625624,41.002124],[-106.857773,41.002663],[-106.453859,41.002057],[-106.217573,40.997734],[-105.730421,40.996886],[-105.277138,40.998173],[-104.855273,40.998048],[-104.675999,41.000957],[-104.053249,41.001406]]]}')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return Object.keys(res.body['data'][0]).length > 0;
      })
      .expect(function (res) {
        return res.body['data'][0]['occurrence'] === 12;
      })
      .expect(200, done);
  });
});

describe('Get Neotoma data with WKT extents:', function () {
  this.timeout(15000);

  it('Get occurrence data using a simple WKT:', function (done) {
    api.get('v2.0/data/occurrences?loc=POLYGON((-104.053249 41.001406,-103.497447 41.001635,-102.865784 41.001988,-102.556789 41.002219,-102.051614 41.002377,-102.051725 40.537839,-102.051744 40.003078,-102.050422 39.646048,-102.048449 39.303138,-102.045388 38.813392,-102.045324 38.453647,-102.044644 38.045532,-102.041574 37.680436,-102.041974 37.352613,-102.04224 36.993083,-102.698142 36.995149,-102.814616 37.000783,-103.002199 37.000104,-103.733247 36.998016,-104.338833 36.993535,-105.000554 36.993264,-105.1208 36.995428,-105.62747 36.995679,-106.201469 36.994122,-106.869796 36.992426,-106.877292 37.000139,-107.420913 37.000005,-108.000623 37.000001,-108.249358 36.999015,-108.620309 36.999287,-109.045223 36.999084,-109.04581 37.374993,-109.041865 37.530726,-109.041058 37.907236,-109.041762 38.16469,-109.060062 38.275489,-109.059541 38.719888,-109.054189 38.874984,-109.051512 39.126095,-109.051363 39.497674,-109.050615 39.87497,-109.050946 40.444368,-109.048044 40.619231,-109.050076 41.000659,-108.884138 41.000094,-108.250649 41.000114,-107.625624 41.002124,-106.857773 41.002663,-106.453859 41.002057,-106.217573 40.997734,-105.730421 40.996886,-105.277138 40.998173,-104.855273 40.998048,-104.675999 41.000957,-104.053249 41.001406))')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return Object.keys(res.body['data'][0]).length > 0;
      })
      .expect(function (res) {
        return res.body['data'][0]['occurrence'] === 12;
      })
      .expect(200, done);
  });
  it('Get site data using a simple WKT:', function (done) {
    api.get('v2.0/data/sites?loc=POLYGON((-104.053249 41.001406,-103.497447 41.001635,-102.865784 41.001988,-102.556789 41.002219,-102.051614 41.002377,-102.051725 40.537839,-102.051744 40.003078,-102.050422 39.646048,-102.048449 39.303138,-102.045388 38.813392,-102.045324 38.453647,-102.044644 38.045532,-102.041574 37.680436,-102.041974 37.352613,-102.04224 36.993083,-102.698142 36.995149,-102.814616 37.000783,-103.002199 37.000104,-103.733247 36.998016,-104.338833 36.993535,-105.000554 36.993264,-105.1208 36.995428,-105.62747 36.995679,-106.201469 36.994122,-106.869796 36.992426,-106.877292 37.000139,-107.420913 37.000005,-108.000623 37.000001,-108.249358 36.999015,-108.620309 36.999287,-109.045223 36.999084,-109.04581 37.374993,-109.041865 37.530726,-109.041058 37.907236,-109.041762 38.16469,-109.060062 38.275489,-109.059541 38.719888,-109.054189 38.874984,-109.051512 39.126095,-109.051363 39.497674,-109.050615 39.87497,-109.050946 40.444368,-109.048044 40.619231,-109.050076 41.000659,-108.884138 41.000094,-108.250649 41.000114,-107.625624 41.002124,-106.857773 41.002663,-106.453859 41.002057,-106.217573 40.997734,-105.730421 40.996886,-105.277138 40.998173,-104.855273 40.998048,-104.675999 41.000957,-104.053249 41.001406))')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return Object.keys(res.body['data'][0]).length > 0;
      })
      .expect(function (res) {
        return res.body['data'][0]['occurrence'] === 12;
      })
      .expect(200, done);
  });
  it('Get dataset data using a simple WKT:', function (done) {
    api.get('v2.0/data/datasets?loc=POLYGON((-104.053249 41.001406,-103.497447 41.001635,-102.865784 41.001988,-102.556789 41.002219,-102.051614 41.002377,-102.051725 40.537839,-102.051744 40.003078,-102.050422 39.646048,-102.048449 39.303138,-102.045388 38.813392,-102.045324 38.453647,-102.044644 38.045532,-102.041574 37.680436,-102.041974 37.352613,-102.04224 36.993083,-102.698142 36.995149,-102.814616 37.000783,-103.002199 37.000104,-103.733247 36.998016,-104.338833 36.993535,-105.000554 36.993264,-105.1208 36.995428,-105.62747 36.995679,-106.201469 36.994122,-106.869796 36.992426,-106.877292 37.000139,-107.420913 37.000005,-108.000623 37.000001,-108.249358 36.999015,-108.620309 36.999287,-109.045223 36.999084,-109.04581 37.374993,-109.041865 37.530726,-109.041058 37.907236,-109.041762 38.16469,-109.060062 38.275489,-109.059541 38.719888,-109.054189 38.874984,-109.051512 39.126095,-109.051363 39.497674,-109.050615 39.87497,-109.050946 40.444368,-109.048044 40.619231,-109.050076 41.000659,-108.884138 41.000094,-108.250649 41.000114,-107.625624 41.002124,-106.857773 41.002663,-106.453859 41.002057,-106.217573 40.997734,-105.730421 40.996886,-105.277138 40.998173,-104.855273 40.998048,-104.675999 41.000957,-104.053249 41.001406))')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return Object.keys(res.body['data'][0]).length > 0;
      })
      .expect(function (res) {
        return res.body['data'][0]['occurrence'] === 12;
      })
      .expect(200, done);
  });
  it('Get dataset data using a simple WKT:', function (done) {
    api.get('v2.0/data/datasets?loc=POLYGON((139.8%20-33.7,%20150.1%20-33.7,%20150.1%20-39.1,%20139.8%20-39.1,%20139.8%20-33.7))')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return Object.keys(res.body['data'][0]).length > 0;
      })
      .expect(function (res) {
        return res.body['data'][0]['occurrence'] === 12;
      })
      .expect(200, done);
  });
});
