var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000/');

// *************************************************
// Geopolitical Units:
//

describe('Get geopolitical data:', function(){
	this.timeout(5000);  // takes a while to run.
	it('An empty query redirects to the api documentation.', function(done) {
		api.get('v2/data/geopoliticalunits/')
		.set('Accept', 'application/json')
		.expect(302, done);
	});

	it('The default limit of 25 should be reached for country level data:', function(done) {
		api.get('v2/data/geopoliticalunits/?rank=1')
		.set('Accept', 'application/json')
		.end(function(err, res){
			assert.equal(Object.keys(res.body.data.result).length, 25);
			done();
		});
	});

	it('Changing the limit should change the number of countries retrieved:', function(done) {
		api.get('v2/data/geopoliticalunits/?rank=1&limit=30')
		.set('Accept', 'application/json')
		.end(function(err, res){
			assert.equal(Object.keys(res.body.data.result).length, 30);
			done();
		});
	});
	
	it('A single geopolitical unit (12) should be returned.', function(done) {
		api.get('v2/data/geopoliticalunits/12')
		.set('Accept', 'application/json')
		.end(function(err, res){
			assert.equal(res.body.data[0]['geopoliticalid'], 12);
			done();
		});
	});

});

// *************************************************
// Site Data:
//


describe('Get site data any number of ways:', function(){
	it('Get site by singular id & return same id:', function(done) {
		api.get('v2/data/sites/12')
		.set('Accept', 'application/json')
		.expect(function(res){
				return Object.keys(res.body['data'][0]).length > 0;
			})
		.expect(function(res){
				return res.body['data'][0]['siteid'] === 12;
			})
		.expect(200, done);
	});
	it('Get site by altitude:', function(done) {
		api.get('v2/data/sites/?altmax=5000&altmin=3000')
		.set('Accept', 'application/json')
		.expect(function(res){
				return Object.keys(res.body['data'][0]).length > 0;
			})
		.expect(200, done);
	});
	it('Break sites by flipping altitudes:', function(done) {
		api.get('v2/data/sites/?altmax=3000&altmin=5000')
		.set('Accept', 'application/json')
		.expect(500, done);
	});
	it('Break sites by passing invalid siteid:', function(done) {
		api.get('v2/data/sites/abcd')
		.set('Accept', 'application/json')
		.expect(500, done);
	});
	it('Get site by geopolitical units returns gp and site data:', function(done) {
		api.get('v2/data/geopoliticalunits/765/sites')
		.set('Accept', 'application/json')
		.expect(function(res){
				return Object.keys(res.body['data'][0]).length === 2;
			})
		.expect(200, done);
	});
});

// *************************************************
// Contact Data:
//

describe('Get contact data:', function(){
	this.timeout(5000);  // takes a while to run.
	it('An empty query redirects to the api documentation.', function(done) {
		api.get('v2/data/contacts/')
		.set('Accept', 'application/json')
		.expect(302, done);
	});

	it('The default limit of 25 should be reached for contact data:', function(done) {
		api.get('v2/data/contacts/?status=retired')
		.set('Accept', 'application/json')
		.end(function(err, res){
			assert.equal(Object.keys(res.body.data.result).length, 25);
			done();
		});
	});

    it('Contact queries should be case insensitive:', function(done) {
		api.get('v2/data/contacts/?status=Retired')
		.set('Accept', 'application/json')
		.end(function(err, res){
			assert.equal(Object.keys(res.body.data.result).length, 25);
			done();
		});
	});


	it('Changing the limit should change the number of contacts retrieved:', function(done) {
		api.get('v2/data/contacts/?status=retired&limit=30')
		.set('Accept', 'application/json')
		.end(function(err, res){
			assert.equal(Object.keys(res.body.data.result).length, 30);
			done();
		});
	});
	
	it('A single contact (12) should be returned.', function(done) {
		api.get('v2/data/contacts/12')
		.set('Accept', 'application/json')
		.end(function(err, res){
			assert.equal(res.body.data[0]['contactid'], 12);
			done();
		});
	});

});

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
