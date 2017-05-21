var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000/');

// *************************************************
// Geopolitical Units:
//
it('should return a 200 response', function(done) {
	api.get('/v2/data/geopoliticalunits/')
	.set('Accept', 'application/json')
	.expect(200, done);
})

it('should return a 200 response', function(done) {
	api.get('/v2/data/geopoliticalunits/12')
	.set('Accept', 'application/json')
	.expect(200, done);
})

// *************************************************
// Publications:
//
it('should return a 200 response', function(done) {
	api.get('/v2/data/publications')
	.set('Accept', 'application/json')
	.expect(200, done);
})

it('should return a 200 response', function(done) {
	api.get('/v2/data/publications/12')
	.set('Accept', 'application/json')
	.expect(200, done);
})
