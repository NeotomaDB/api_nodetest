'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/spatial/lakes', function() {
    describe('tests for get', function() {
        it('should respond 200 for "An object containing all matched lakes within some buffer distance of a site. Data derived from the [HydroLakes database](https://www.hydrosheds.org/products/hydrolakes):<br> * Messager, M.L., Lehner, B., Grill, G., Nedeva, I., Schmitt, O. (2016). Estimating the volume and age of water stored in global lakes using a geo-statistical approach. *Nature Communications*, 7: 13603. doi: [10.1038/ncomms13603](https://doi.org/10.1038/ncomms13603) "', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/spatial/lakes', { 
                'qs': {"siteid":48315,"buffer":8389,"prec": 1000,"proj": 4326},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});