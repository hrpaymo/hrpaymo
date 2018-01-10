
const app = require('../server/app.js');
const request = require('supertest');
var chai = require('chai');
var expect = chai.expect;

describe('Test Global Feed /feed/global', function() {
  it('respond with json', function(done) {
    request(app)
      .get('/feed/global')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        expect(res.body.items).to.be.an('array');
        done();
      })
  });
});
