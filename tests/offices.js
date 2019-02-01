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

  describe('DELETE /', () => {
    // Test should delete office since id exist
    it('should delete political office', done => {
      chai
        .request(app)
        .delete(`/api/v1/offices/${1}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test should not delete an office since it does not exist
    it('should not delete political office', done => {
      chai
        .request(app)
        .delete(`/api/v1/offices/${5334}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('PATCH /', () => {
    // Test should not update an office since id does not exist
    it('should not update political office', done => {
      chai
        .request(app)
        .patch(`/api/v1/offices/${5334}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test should not update an office since name is too short
    it('should not update political office since name is short', done => {
      chai
        .request(app)
        .patch(`/api/v1/offices/${2}/emma`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test should update office since name and id exist
    it('should update political office id exist and name is long enough', done => {
      chai
        .request(app)
        .patch(`/api/v1/offices/${2}/${'This is a changed name'}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
