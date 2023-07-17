process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcryptjs');
const app = require('../index');

chai.use(chaiHttp);
const expect = chai.expect;

describe('User Registration', () => {
  it('should create a new user and return user details', (done) => {
    chai
      .request(app)
      .post('/api/users/register')
      .send({ email: 'user@example.com', password: 'password123' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.nested.property('user.email').to.equal('user@example.com');
        expect(res.body).to.have.nested.property('user.password');
        const isMatch = bcrypt.compareSync('password123', res.body.user.password);
        expect(isMatch).to.be.true;
        done();
      });
  });

  it('should return an error if required fields are missing', (done) => {
    chai
      .request(app)
      .post('/api/users/register')
      .send({ email: 'user@example.com' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  // Add more test cases for edge cases, validation, etc.
});

describe('User Login', () => {
  let jwtToken = '';

  it('should return a JWT token on successful login', (done) => {
    chai
      .request(app)
      .post('/api/users/login')
      .send({ email: 'user@example.com', password: 'password123' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        jwtToken = res.body.token;
        done();
      });
  });

  it('should return an error on invalid credentials', (done) => {
    chai
      .request(app)
      .post('/api/users/login')
      .send({ email: 'user@example.com', password: 'wrongpassword' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  //Test protected route
  it('should return user details on successful authentication', (done) => {
    chai
      .request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.nested.property('user.email').to.equal('user@example.com');
        done();
      });
  });

  // Write more test cases for different scenarios
});
