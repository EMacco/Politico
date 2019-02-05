import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('Users', () => {
  describe('GET /', () => {
    // Test should return status code 404 user does not exist
    it('should get a particular user if he exist', done => {
      chai
        .request(app)
        .get(`/api/v1/users/${1}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
