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

    // Test should return status code 404
    it('should return status 404 office does not exist', done => {
      chai
        .request(app)
        .get(`/api/v1/offices/${432}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('POST /', () => {
    // Test should create an office since all fields are complete
    it('should create political office', done => {
      const office = {
        name: 'Office of the President',
        type: 'federal',
        logoUrl: 'http://google.com/president-of-nigeria.png'
      };
      chai
        .request(app)
        .post('/api/v1/offices')
        .send(office)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test should not create an office without required field
    it('should not create political office', done => {
      const office = {
        type: 'Federal',
        logoUrl: 'http://google.com/president-of-nigeria.png'
      };
      chai
        .request(app)
        .post('/api/v1/offices')
        .send(office)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test should not create an office because it has invalid type office
    it('should not create political office', done => {
      const office = {
        name: 'President',
        type: 'fake type',
        logoUrl: 'http://google.com/president-of-nigeria.png'
      };
      chai
        .request(app)
        .post('/api/v1/offices')
        .send(office)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
