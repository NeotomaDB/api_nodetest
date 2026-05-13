'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/pollen', function() {
    describe('tests for get', function() {
        it('should respond 200 for "A record of all pollen samples in time/space for a particular taxon."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/pollen', { 
                'qs': {"taxonname":"esse ut dolore labore","taxonid":32590,"siteid":30859,"sitename":"sit","datasettype":"geochronologic","altmin": 10,"altmax": 100,"loc":"{\"type\":\"Polygon\",\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\"EPSG:4326\"}},\"coordinates\":[[[13.4,55.92],[13.5,55.92],[13.5,55.95],[13.4,55.95],[13.4,55.92]]]}","ageof":15225459,"ageyoung": 1000,"ageold": 10000,"limit": 10,"offset": 0},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});