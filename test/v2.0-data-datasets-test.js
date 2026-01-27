'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/datasets', function() {
    describe('tests for get', function() {
        it('should respond 200 for "An array of datasets."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/datasets', { 
                'qs': {"sitename":"ut cillum consectetur","database":"St. Croix Watershed Research Station of the Science Museum of Minnesota","datasettype":"macroinvertebrate","altmin": 10,"altmax": 100,"loc":"{\"type\":\"Polygon\",\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\"EPSG:4326\"}},\"coordinates\":[[[13.4,55.92],[13.5,55.92],[13.5,55.95],[13.4,55.95],[13.4,55.92]]]}","siteid":31891,"datasetid":23595575,"doi":"10B18997295/TZX21W4","gpid":5392,"keyword":"modern","contactid":20234,"taxa":"exercitation amet irure Excepteur","ageyoung": 1000,"ageold": 10000,"ageof":7003042,"limit": 10,"offset": 0},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});