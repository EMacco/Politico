import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/index';

// Configure chai
chai.use(chaiHttp);
chai.should();

let createdIndex;
const adminToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJmaXJzdG5hbWUiOiJFbW1hbnVlbCIsImxhc3RuYW1lIjoiT2t3YXJhIiwib3RoZXJuYW1lIjoiTmR1a2EiLCJlbWFpbCI6ImVtbWE0cmVhbDM3QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJGdBZUFla3RWdE9xMWJkbHIuQ1hISnVHb2xTVjVTbDIvLms2VjY3NS9Qd1h0dWJjUy5QaC9tIiwicGhvbmVudW1iZXIiOiIwODEyNDE4NTMyMCIsInBhc3Nwb3J0dXJsIjoiaHR0cHM6Ly8iLCJpc2FkbWluIjp0cnVlLCJwYXJ0eWlkIjpudWxsfSwiaWF0IjoxNTUxMjA2MTU4fQ.j-kxWa0sFeJAcJJFaStIr8PjxHIeABZvDVTTVWzxzCc';

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

  // Testing authentication
  describe('Authorization /', () => {
    it('should return unauthorized access', done => {
      chai
        .request(app)
        .get(`/api/v1/users/${createdIndex}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should return 401 since token is invalid or expired', done => {
      chai
        .request(app)
        .get(`/api/v1/users/${createdIndex}`)
        .set('x-access-token', 'this_token_is_invalid')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should not create political office since the user is not an admin', done => {
      const office = {
        name: 'Office of the President',
        type: 'federal',
        logoUrl: 'http://google.com/president-of-nigeria.png'
      };

      chai
        .request(app)
        .post('/api/v1/offices')
        .send(office)
        .set(
          'x-access-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImZpcnN0TmFtZSI6IlRoaXMgaXMgYSBwYXJ0eSIsImxhc3ROYW1lIjoiZmVkZXJhbCByb2FkIiwiZW1haWwiOiJ0ZXN0cHJpdmlsZWRnZUB0ZXN0LmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJDFObzRROS9SWFVyV21XL05URkNTR3UuZVRINS91U2hXWUFFbTAuUGxYUms0RHlNVDNyVE5pIiwicGhvbmVOdW1iZXIiOiIzNzI3NzgzNzc4NSIsInBhc3Nwb3J0VXJsIjoiaHR0cDovL2dvb2dsZS5jb20iLCJpc0FkbWluIjpmYWxzZX0sImlhdCI6MTU1MDU4NTUxOSwiZXhwIjoxNTUwNTg5MTE5fQ.OW6JXWfufkid1VO4NaoqhHl0JpLqvPxec-arws9PBc4'
        )
        .end((err, res) => {
          res.should.have.status(401);
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

  describe('PATCH /', () => {
    // Test should not update profileImageUrl because user is not signed in
    it('should not update profile picture, user not signed in', done => {
      chai
        .request(app)
        .patch(`/api/v1/users/passport`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should not update profile image, userID does not exist', done => {
      chai
        .request(app)
        .patch(`/api/v1/users/passport`)
        .set('x-access-token', process.env.TEST_TOKEN)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should not update profile image, imageUrl is not valid', done => {
      chai
        .request(app)
        .patch(`/api/v1/users/passport`)
        .send({ imageUrl: 'whatever' })
        .set('x-access-token', adminToken)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should update profile image, user and url are valid', done => {
      chai
        .request(app)
        .patch(`/api/v1/users/passport`)
        .send({ imageUrl: 'https://' })
        .set('x-access-token', adminToken)
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
