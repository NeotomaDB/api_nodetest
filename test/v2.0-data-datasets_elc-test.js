'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/datasets_elc', function() {
    describe('tests for get', function() {
        it('should respond 200 for "A Neotoma datasets object suitable for the EarthLife Consortium API."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/datasets_elc', { 
                'qs': {"siteid":34170,"contactid":948,"datasettype":"microcharcoal","altmin": 10,"altmax": 100,"loc":"{\"type\":\"Polygon\",\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\"EPSG:4326\"}},\"coordinates\":[[[13.4,55.92],[13.5,55.92],[13.5,55.95],[13.4,55.95],[13.4,55.92]]]}","ageyoung": 1000,"ageold": 10000,"ageof":10605188},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});