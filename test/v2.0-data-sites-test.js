'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/sites', function() {
    describe('tests for get', function() {
        it('should respond 200 for "An array of sites."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/sites', { 
                'qs': {"sitename":"adipisicing non","database":"Neotoma Midden Database","datasettype":"diatom","altmin": 10,"altmax": 100,"loc":"{\"type\":\"Polygon\",\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\"EPSG:4326\"}},\"coordinates\":[[[13.4,55.92],[13.5,55.92],[13.5,55.95],[13.4,55.95],[13.4,55.92]]]}","siteid":47233,"datasetid":43001185,"doi":"10W6058/Y.UJO2","gpid":5392,"keyword":"modern","contactid":18443,"taxa":"sed ullamco culpa laborum","ageyoung": 1000,"ageold": 10000,"ageof":12270010,"limit": 10,"offset": 0},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});