const chai = require('chai');
const assert = require('assert');
const should = require('chai').should();
const expect = chai.expect;
const supertest = require('supertest');
const path = require('path');
const axios = require('axios');
const YAML = require('yamljs');

const dotenv = require('dotenv');
dotenv.config();

let testroute = process.env.APIPATH;
if (typeof process.env.APIPATH === 'undefined') {
  testroute = 'http://localhost:' + process.env.APIPORT;
}
console.log(testroute);
const api = supertest(testroute);

const fullPath = path.join(process.cwd(), 'openapi.yaml');
const apidoc = YAML.load(fullPath);

// Import this plugin
const chaiResponseValidator = require('chai-openapi-response-validator');

// Load an OpenAPI file (YAML or JSON) into this plugin
chai.use(chaiResponseValidator(fullPath));

const paths = Object.keys(apidoc.paths);
let apipath = '';
let description = '';

function runTest(description, apipath) {
  describe(description, () => {
    it('should satisfy OpenAPI spec', async () => {
      // Get an HTTP response from your server (e.g. using axios)
      console.log(testroute + apipath);
      const res = await axios.get(testroute + apipath);

      expect(res.status).to.equal(200);
      expect(res).to.satisfyApiSpec;
    });
  });
}

for (let step = 0; step < paths.length; step++) {
  apipath = paths[step];
  description = 'GET ' + apipath;

  if (apipath.includes('dbtables')) {
    apipath = apipath.replace(/{.*}/, 'agetypes');
  } else {
    apipath = apipath.replace(/{.*}/, 1);
  }
  runTest(description, apipath);
}
