var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');

const dotenv = require('dotenv');
dotenv.config();

var api = supertest('http://localhost:' + process.env.APIPORT + '/');

// *************************************************
// Main controllers:
//

describe('Any path goes to the api documentation:', function(){
	it('`api-docs` redirects to the api documentation.', function(done) {
		api.get('v2')
		.set('Accept', 'application/json')
		.expect(302, done);
	});
});
