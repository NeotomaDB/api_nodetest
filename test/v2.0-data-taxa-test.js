'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/taxa', function() {
    describe('tests for get', function() {
        it('should respond 200 for "A taxon or array of taxa."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/taxa', { 
                'qs': {"taxonname":"non dolor consequat","taxagroup":"in consectetur","ecolgroup":"et ut ex","status":true,"limit": 10,"offset": 0},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});