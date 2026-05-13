'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/sites', function() {
    describe('tests for get', function() {
        it('should respond 200 for "An array of sites."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/sites', { 
                'qs': {"sitename":"nostrud velit dolore in in","database":"Diatom Paleolimnology Data Cooperative (DPDC)","datasettype":"modern biochemistry","altmin": 10,"altmax": 100,"loc":"{\"type\":\"Polygon\",\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\"EPSG:4326\"}},\"coordinates\":[[[13.4,55.92],[13.5,55.92],[13.5,55.95],[13.4,55.95],[13.4,55.92]]]}","siteid":2022,"datasetid":67760076,"doi":"10)73259/W8;78U83/","gpid":5392,"keyword":"bottom","contactid":20094,"taxa":"adipisicing nostrud exercitation","ageyoung": 1000,"ageold": 10000,"ageof":19655794,"limit": 10,"offset": 0},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});