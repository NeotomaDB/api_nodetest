'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/pollen', function() {
    describe('tests for get', function() {
        it('should respond 200 for "A record of all pollen samples in time/space for a particular taxon."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/pollen', { 
                'qs': {"taxonname":"Lorem deserunt exercitation ut in","taxonid":5092,"siteid":32098,"sitename":"nostrud dolor veniam","datasettype":"charcoal surface sample","altmin":1966,"altmax":5439,"loc":"{\"type\":\"Polygon\",\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\"EPSG:4326\"}},\"coordinates\":[[[13.4,55.92],[13.5,55.92],[13.5,55.95],[13.4,55.95],[13.4,55.92]]]}","ageof":21067554,"ageyoung":6524060,"ageold":17641754,"limit":6133,"offset":92223285},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});