var chai = require("chai");
let chaiHttp = require('chai-http');
var assert = chai.assert,
  expect = chai.expect;

chai.use(chaiHttp);

describe('/GET http://localhost:3000/test', () => {
  it('runs', function (done) { // <= Pass in done callback
    chai.request('http://localhost:3000')
      .get('/test')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();                               // <= Call done to signal callback end
      });
  });
});