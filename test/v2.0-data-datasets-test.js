'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/datasets', function () {
  describe('tests for get', function () {
    it('should respond 200 for "An array of datasets."', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/datasets', {
        'qs': { 'datasetid': 64431408, 'siteid': 26258, 'contactid': 12667, 'datasettype': 'esse commodo eiusmod aliqua irure', 'altmin': 10, 'altmax': 100, 'loc': '{"type":"Polygon","coordinates":[[[-104.053249,41.001406],[-104.675999,41.000957],[-104.855273,40.998048],[-105.277138,40.998173],[-105.730421,40.996886],[-106.217573,40.997734],[-106.453859,41.002057],[-106.857773,41.002663],[-107.625624,41.002124],[-108.250649,41.000114],[-108.884138,41.000094],[-109.050076,41.000659],[-109.048044,40.619231],[-109.050946,40.444368],[-109.050615,39.87497],[-109.051363,39.497674],[-109.051512,39.126095],[-109.054189,38.874984],[-109.059541,38.719888],[-109.060062,38.275489],[-109.041762,38.16469],[-109.041058,37.907236],[-109.041865,37.530726],[-109.04581,37.374993],[-109.045223,36.999084],[-108.620309,36.999287],[-108.249358,36.999015],[-108.000623,37.000001],[-107.420913,37.000005],[-106.877292,37.000139],[-106.869796,36.992426],[-106.201469,36.994122],[-105.62747,36.995679],[-105.1208,36.995428],[-105.000554,36.993264],[-104.338833,36.993535],[-103.733247,36.998016],[-103.002199,37.000104],[-102.814616,37.000783],[-102.698142,36.995149],[-102.04224,36.993083],[-102.041974,37.352613],[-102.041574,37.680436],[-102.044644,38.045532],[-102.045324,38.453647],[-102.045388,38.813392],[-102.048449,39.303138],[-102.050422,39.646048],[-102.051744,40.003078],[-102.051725,40.537839],[-102.051614,41.002377],[-102.556789,41.002219],[-102.865784,41.001988],[-103.497447,41.001635],[-104.053249,41.001406]]]}', 'gpid': 5583, 'ageyoung': 1000, 'ageold': 10000, 'ageof': 8299746, 'limit': 10, 'offset': 0 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
