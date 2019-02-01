import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('Users', () => {
  describe('GET /', () => {
    // Test should return a particular user
    it('should get a particular user', done => {
      chai
        .request(app)
        .get(`/api/v1/users/${'okwarae.n@gmail.com'}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test should return status code 404 user does not exist
    it('should return status 404 party does not exist', done => {
      chai
        .request(app)
        .get(`/api/v1/users/${'petergriffin@gmail.com'}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
