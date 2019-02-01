import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('Political Offices', () => {
  describe('GET /', () => {
    // Test should return a list of all political offices
    it('should get all political office', done => {
      chai
        .request(app)
        .get('/api/v1/offices')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test should return a particular office
    it('should get a particular political office', done => {
      chai
        .request(app)
        .get(`/api/v1/offices/${1}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
