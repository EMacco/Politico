import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/index';

// Configure chai
chai.use(chaiHttp);
chai.should();

let createdIndex;

describe('Users', () => {
  describe('POST /', () => {
    // Test should create a user since all fields are complete
    it('should create new user', done => {
      const user = {
        firstName: 'This is a test',
        lastName: 'federal road',
        email: process.env.TEST_EMAIL,
        password: process.env.TEST_PASSWORD,
        phoneNumber: '37277837785',
        passportUrl: 'http://google.com',
        isAdmin: 'true'
      };
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(user)
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          createdIndex = res.body.data[0].user.id;
          res.should.have.status(201);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test should not create a new user without a required field (There is no email and password)
    it('should not create new user since there is no email and password', done => {
      const user = {
        firstName: 'This is a party',
        lastName: 'federal road',
        phoneNumber: '37277837785',
        passportUrl: 'http://google.com',
        isAdmin: 'true'
      };
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(user)
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test should not create user exists
    it('should not create user because user exists', done => {
      const user = {
        firstName: 'This is a party',
        lastName: 'federal road',
        email: 'sdnwssd@scnssj.sdcsdj',
        password: 'bhsbjdhbjshbhbs',
        phoneNumber: '37277837785',
        passportUrl: 'http://google.com',
        isAdmin: 'true'
      };
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(user)
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test user can sign in
    it('should be able to login', done => {
      const user = {
        email: 'sdnwssd@scnssj.sdcsdj',
        password: 'bhsbjdhbjshbhbs'
      };
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('GET /', () => {
    // Test should return status code 200 user exists
    it('should get a particular user since he exist', done => {
      chai
        .request(app)
        .get(`/api/v1/users/${createdIndex}`)
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
    it('should delete user', done => {
      chai
        .request(app)
        .delete(`/api/v1/users/${createdIndex}`)
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
        .delete(`/api/v1/users/${0}`)
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
