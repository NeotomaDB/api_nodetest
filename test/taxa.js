var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000/');

// *************************************************
// Taxon Data:
//

describe('Get taxon data:', function(){
	it('An empty query redirects to the api documentation.', function(done) {
		api.get('v2/data/taxa/')
		.set('Accept', 'application/json')
		.expect(302, done);
	});

	it('A single taxon should be returned by id:', function(done) {
		api.get('v2/data/taxa/12')
		.set('Accept', 'application/json')
		.end(function(err, res){
			assert.equal(res.body.data[0]['taxonid'], 12);
			done();
		});
	});

    it('Taxon queries should be case insensitive:', function(done) {
		api.get('v2/data/taxa/?taxonname=abies')
		.set('Accept', 'application/json')
		.end(function(err, res){
			assert.equal(res.body.data[0]['taxonid'], 1);
			done();
		});
	});
	it('Taxon queries should accept `*` as a wildcard:', function(done) {
		api.get('v2/data/taxa/?taxonname=abie*')
		.set('Accept', 'application/json')
		.end(function(err, res){
			assert.equal(res.body.data[0]['taxonid'], 1);
			done();
		});
	});

	it('The default limit of 25 should be reached for taxon data:', function(done) {
		api.get('v2/data/taxa/?taxonname=a*')
		.set('Accept', 'application/json')
		.end(function(err, res){
			assert.equal(res.body.data.length, 25);
			done();
		});
	});

	it('Changing the limit should change the number of taxa retrieved:', function(done) {
		api.get('v2/data/taxa/?taxonname=a*&limit=30')
		.set('Accept', 'application/json')
		.end(function(err, res){
			assert.equal(res.body.data.length, 30);
			done();
		});
	});
	

});
