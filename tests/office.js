import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/index';

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('Political Offices', () => {
  describe('POST /', () => {
    // Test for registering candidate
    it('should not register candidate since user is not signed in', done => {
      chai
        .request(app)
        .post('/api/v1/office/1/register')
        .send({
          officeId: 'hdsj',
          partyId: 'dsjhjgj'
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should not register candidate since officeid and partyid are not numbers', done => {
      chai
        .request(app)
        .post('/api/v1/office/1/register')
        .send({
          officeId: 'hdsj',
          partyId: 'dsjhjgj'
        })
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should not register candidate since office does not exist', done => {
      chai
        .request(app)
        .post('/api/v1/office/1/register')
        .send({
          officeId: 0,
          partyId: 0
        })
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should not register candidate since party does not exist', done => {
      chai
        .request(app)
        .post('/api/v1/office/1/register')
        .send({
          officeId: 0,
          partyId: 0
        })
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });

    // Tests for scheduling an election
    it('should not schedule election since user is not signed in', done => {
      chai
        .request(app)
        .post('/api/v1/office/schedule')
        .send({
          officeId: 23,
          date: '2019-02-25'
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should not schedule election since office does not exist', done => {
      chai
        .request(app)
        .post('/api/v1/office/schedule')
        .send({
          officeId: 0,
          date: '2019-02-25'
        })
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done();
        });
    });

    // Tests for fetching election result
    it('should not return election result since user is not signed in', done => {
      chai
        .request(app)
        .post('/api/v1/office/0/result')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should not return election result since office does not exist', done => {
      chai
        .request(app)
        .post('/api/v1/office/0/result')
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('GET /', () => {
    // Tests for fetching votes for an office
    it('should not return office votes since user is not signed in', done => {
      chai
        .request(app)
        .get('/api/v1/office/0/office-votes')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should not return votes since office does not exist', done => {
      chai
        .request(app)
        .get('/api/v1/office/0/office-votes')
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done();
        });
    });

    // Tests for fetching votes for a user
    it('should not return office votes since user is not signed in', done => {
      chai
        .request(app)
        .get('/api/v1/office/0/user-votes')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should not return votes since user does not exist', done => {
      chai
        .request(app)
        .get('/api/v1/office/0/user-votes')
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should return votes since user is signed in and exist', done => {
      chai
        .request(app)
        .get('/api/v1/office/1/user-votes')
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
