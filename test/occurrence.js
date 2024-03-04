'use strict';
const assert = require('assert');
const should = require('chai').should();
const expect = require('chai').expect;
const supertest = require('supertest');

const dotenv = require('dotenv');
dotenv.config();

let testroute = process.env.APIPATH;

if (typeof process.env.APIPATH === 'undefined') {
  testroute = 'http://localhost:' + process.env.APIPORT + '/';
}
console.log(testroute);
const api = supertest(testroute);

// *************************************************
// Occurrence Data:
//

describe('Get occurrence data any number of ways:', function() {
  this.timeout(30000);

  it('Get occurrence by singular id & return same id:', (done) => {
    api.get('v2.0/data/occurrences/12')
        .set('Accept', 'application/json')
        .expect(function(res) {
          return Object.keys(res.body['data'][0]).length > 0;
        })
        .expect(function(res) {
          return res.body['data'][0]['occurrence'] === 12;
        })
        .expect(200);
    done();
  });

  it('Get the Flyover test call:', (done) => {
    api.get('v2.0/data/occurrences?taxonname=rhinocerotidae,megacerops,moeritherium,ceratogaulus,gomphotherium,deinotherium,condylarthra,paraceratherium,mesonychia,pantodonta,hyaenodon,thylacosmilus,glyptodon,castoroides,toxodon,megatherium,arctodus,smilodon,mammuthus,mammut,coelodonta,megaloceras,gigantopithecus,phlegethontia,temnospondyli,lepospondyli,ichthyosauria,sauropterygia,mosasauroidea,pterosauromorpha,titanoboa,megalania,placodus,tanystropheidae,hyperodapedon,stagonolepis,scutosaurus,pareiasauria,archelon,stupendemys,protostega,placodermi,leedsichthys,onychodontiformes,acanthostega,ichthyostega,crassigyrinus,ornithosuchus,erpetosuchidae,protosuchus,dakosaurus,geosaurus,deinosuchus&lower=true&limit=999999&loc=POLYGON((-122.56 39.94,-115.21 41.96,-107.99 43.42,-100.51 44.41,-92.85 44.91,-83.49 44.84,-74.25 44.02,-70.19 43.38,-69.36 42.75,-69.02 41.76,-69.13 41.07,-69.5 40.47,-70.07 40.06,-70.75 39.9,-78.36 40.86,-85.79 41.33,-93.27 41.3,-100.68 40.78,-105.86 40.12,-111.42 39.12,-116.79 37.86,-122.28 36.29,-122.98 36.35,-123.61 36.67,-124.06 37.21,-124.27 37.88,-124.21 38.58,-123.89 39.2,-123.35 39.65,-122.56 39.94))')
        .set('Accept', 'application/json')
        .expect(function(res) {
          return Object.keys(res.body['data'][0]).length > 0;
        })
        .expect(200);
    done();
  });

  it('Failing Canis test works:', function(done) {
    // This casuses timeout fails for some reason.  It's frustrating.
    api.get('v2.0/data/occurrences?taxonname=Canis&lower=true&limit=999999')
        .set('Accept', 'application/json')
        .expect(function(res) {
          return Object.keys(res.body['data'][0]).length > 0;
        })
        .expect(200);
    done();
  });

  it('Get occurrence by taxon:', function(done) {
    api.get('v2.0/data/taxa/12/occurrences')
        .set('Accept', 'application/json')
        .expect(function(res) {
          return Object.keys(res.body['data'][0]).length > 0;
        })
        .expect(200);
    done();
  });

  it('Break occurrences by flipping altitudes:', function(done) {
    api.get('v2.0/data/occurrences/?altmax=3000&altmin=5000')
        .set('Accept', 'application/json')
        .expect(500);
    done();
  });

  it('Break occurrences by flipping ages:', function(done) {
    api.get('v2.0/data/occurrences/?ageyoung=5000&ageold=3000')
        .set('Accept', 'application/json')
        .expect(500);
    done();
  });

  it('Occurrences filter by age:', function(done) {
    api.get('v2.0/data/occurrences/?ageyoung=3000&ageold=5000')
        .set('Accept', 'application/json')
        .expect(function(res) {

        })
        .expect(200);
    done();
  });

  it('Get occurrences with comma separated fields:', function(done) {
    api.get('v2.0/data/occurrences/' +
      '?siteid=12,13,14,15&taxonname=Betula&limit=200')
        .set('Accept', 'application/json')
        .expect(function(res) {
          const allSite = res.body['data'];
          const siteids = [];
          for (let i = 0; i < allSite.length; i++) {
            siteids.push(allSite[i]['site']['siteid']);
          };
          const uniqueSites = Array.from(new Set(siteids)).sort(function(a, b) {
            return a - b;
          });
          return (uniqueSites.every((item) => [12, 13, 14, 15].includes(item)));
        })
        .expect(200);
    done();
  });

  it('Get occurrences with comma separated taxa:', function(done) {
    api.get('v2.0/data/occurrences/?taxonname=Picea,Abies&limit=25')
        .set('Accept', 'application/json')
        .expect(function(res) {
          return (res.body.data.length > 0);
        })
        .expect(200);
    done();
  });

  it('Get hierarchical occurrences with comma separated taxa:', function(done) {
    api.get('v2.0/data/occurrences/?taxonname=Picea,Abies&limit=25&lower=true')
        .set('Accept', 'application/json')
        .expect(function(res) {
          return (res.body.data.length > 0);
        })
        .expect(200);
    done();
  });

  it('Get occurrences returns lower taxa:', function(done) {
    api.get('v2.0/data/occurrences/?taxonname=Myrica&lower=true&limit=200')
        .set('Accept', 'application/json')
        .expect(function(res) {
          const allTaxa = res.body['data'];
          const taxaids = [];
          for (let i = 0; i < allTaxa.length; i++) {
            taxaids.push(allTaxa[i]['sample']['taxonname']);
          };
          const uniqueTaxa = Array.from(new Set(taxaids)).sort();
          return uniqueTaxa.length > 1;
        })
        .expect(200);
    done();
  });

  it('Get occurrences with mammals and lower taxa works:', function(done) {
    api.get('v2.0/data/occurrences/?taxonname=Homo&lower=true&limit=25')
        .set('Accept', 'application/json')
        .expect(function(res) {
          const allTaxa = res.body['data'];
          const taxaids = [];
          for (let i = 0; i < allTaxa.length; i++) {
            taxaids.push(allTaxa[i]['sample']['taxonname']);
          };
          const uniqueTaxa = Array.from(new Set(taxaids)).sort();
          return uniqueTaxa.length > 1 & allTaxa.length > 0;
        })
        .expect(200);
    done();
  });

  it('Get occurrences using taxon and age bounds:', function(done) {
    api.get('v2.0/data/occurrences/?ageyoung=2000&ageold=3000&taxonname=Pinus')
        .set('Accept', 'application/json')
        .expect(function(res) {
          return Object.keys(res.body['data'][0]).length > 0;
        })
        .expect(200);
    done();
  });
});
