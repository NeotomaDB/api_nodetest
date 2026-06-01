'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/sites', function() {
    describe('tests for get', function() {
        it('should respond 200 for "An array of sites."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/sites', { 
                'qs': {"sitename":"ullamco veniam occaecat ut commodo","database":"ANTIGUA","datasettype":"stable isotope","altmin": 10,"altmax": 100,"loc":"{\"type\":\"Polygon\",\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\"EPSG:4326\"}},\"coordinates\":[[[13.4,55.92],[13.5,55.92],[13.5,55.95],[13.4,55.95],[13.4,55.92]]]}","siteid":21144,"datasetid":66224974,"doi":"10k34784//CLAHO/","gpid":5392,"keyword":"pre-European","contactid":15006,"taxa":"amet consectetur laborum reprehenderit ipsum","ageyoung": 1000,"ageold": 10000,"ageof":10072131,"limit": 10,"offset": 0},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});