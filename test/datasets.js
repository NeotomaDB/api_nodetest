var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000/');

// *************************************************
// Datasets:
//

describe('Get datasets any number of ways:', function(){
	it('Get dataset by singular id & return same id:', function(done) {
		api.get('v2/data/datasets/12')
		.set('Accept', 'application/json')
		.expect(function(res){
				return Object.keys(res.body['data'][0]).length > 0;
			})
		.expect(function(res){
				return res.body['data'][0]['siteid'] === 12;
			})
		.expect(200, done);
	});
	it('Returns all key elements of the object:', function(done) {
		api.get('v2/data/datasets/12')
		.set('Accept', 'application/json')
		.expect(function(res){
				return Object.keys(res.body['data']).includes('site', 'dataset');
			})
		.expect(200, done);
	});

});

