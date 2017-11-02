var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000/');

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

	it('All contacts from datasets should be returned.', function(done) {
		api.get('v2/data/datasets/12,13/contacts')
		.set('Accept', 'application/json')
		.end(function(err, res){
			assert.equal(Object.keys(res.body.data[0]['contact'][0])[0], 'contactid');
			done();
		});
	});

	it('The length of returned contacts should be equivalent to the number of datasets.', function(done) {
		api.get('v2/data/datasets/12,13/contacts')
		.set('Accept', 'application/json')
		.end(function(err, res){
			assert.equal(res.body.data.length, 2);
			done();
		});
	});

	it('All contacts from sites should be returned.', function(done) {
		api.get('v2/data/sites/1001,2341/contacts')
		.set('Accept', 'application/json')
		.end(function(err, res){
			assert.equal(Object.keys(res.body.data[0]['contact'][0])[0], 'contactid');
			done();
		});
	});
	it('The length of returned contacts should be equivalent to the number of sites.', function(done) {
		api.get('v2/data/datasets/102,1435,1,27/contacts')
		.set('Accept', 'application/json')
		.end(function(err, res){
			assert.equal(res.body.data.length, 4);
			done();
		});
	});

});
