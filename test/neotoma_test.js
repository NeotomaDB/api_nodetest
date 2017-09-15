var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000/');

// *************************************************
// Geopolitical Units:
//

describe('Get geopolitical data:', function(){
	this.timeout(5000);  // takes a while to run.
	it('A number of geopolitical units should be returned.', function(done) {
		api.get('v2/data/geopoliticalunits/')
		.set('Accept', 'application/json')
		.expect(function(res){
			Object.keys(res).length > 10;
		})
		.expect(200, done)
	});
	
	it('A single geopolitical unit (12) should be returned.', function(done) {
	api.get('v2/data/geopoliticalunits/12')
		.set('Accept', 'application/json')
		.expect(function(res){
			return res.body['data'][0]['geopoliticalid'] === 12;
		})
		.expect(200, done);
	});

});

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