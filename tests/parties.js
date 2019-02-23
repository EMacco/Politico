import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/index';

// Configure chai
chai.use(chaiHttp);
chai.should();

let createdIndex;

describe('Political Parties', () => {
  describe('POST /', () => {
    // Test should not create a party since hq address is short
    it('should create political party', done => {
      const party = {
        name: 'All Progressive Congress',
        hqAddress: 'Abuja',
        logoUrl: 'http://google.com/president-of-nigeria.png'
      };
      chai
        .request(app)
        .post('/api/v1/parties')
        .send(party)
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test should create a party since all fields are complete
    it('should create political party', done => {
      const party = {
        name: 'All Progressive Congress',
        hqAddress: 'Garki Abuja, Nigeria',
        logoUrl: 'http://google.com/president-of-nigeria.png'
      };
      chai
        .request(app)
        .post('/api/v1/parties')
        .send(party)
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          createdIndex = res.body.data[0].id;
          res.should.have.status(201);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test should not create a party without required field
    it('should not create political party', done => {
      const party = {
        hqAddress: 'Lagos',
        logoUrl: 'http://google.com/president-of-nigeria.png'
      };
      chai
        .request(app)
        .post('/api/v1/parties')
        .send(party)
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test should not create a party without required field
    it('should not update user political party. Bad request', done => {
      const body = {
        partyId: 'gfgf'
      };
      chai
        .request(app)
        .post('/api/v1/parties/join')
        .send(body)
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test should not create a party without required field
    it('should not update user political party since user id is not specified', done => {
      const body = {
        partyId: 0
      };
      chai
        .request(app)
        .post('/api/v1/parties/join')
        .send(body)
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('GET /', () => {
    // Test should return a list of all political parties
    it('should get all political party', done => {
      chai
        .request(app)
        .get('/api/v1/parties')
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test should return a particular political party
    it('should get a particular political party', done => {
      chai
        .request(app)
        .get(`/api/v1/parties/${createdIndex}`)
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test should return status code 404
    it('should return status 404 party does not exist', done => {
      chai
        .request(app)
        .get(`/api/v1/parties/${0}`)
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('PATCH /', () => {
    // Test should not update a party since id does not exist
    it('should not update political party', done => {
      chai
        .request(app)
        .patch(`/api/v1/parties/${0}`)
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test should not update a party since name is too short
    it('should not update political party since name is short', done => {
      chai
        .request(app)
        .patch(`/api/v1/parties/${createdIndex}/name`)
        .send({ name: 'emma' })
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test should update party since name and id exist
    it('should update political party id exist and name is long enough', done => {
      chai
        .request(app)
        .patch(`/api/v1/parties/${createdIndex}/name`)
        .send({ name: 'This is a changed name' })
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('DELETE /', () => {
    // Test should delete party since id exist
    it('should delete political party', done => {
      chai
        .request(app)
        .delete(`/api/v1/parties/${createdIndex}`)
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test should not delete a party since it does not exist
    it('should not delete political party', done => {
      chai
        .request(app)
        .delete(`/api/v1/parties/${0}`)
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
