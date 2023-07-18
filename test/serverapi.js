process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcryptjs');
const app = require('../index');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Server Creation', () => {
  //Test protected route
  it('should create a new server', (done) => {
    chai
      .request(app)
      .post('/api/servers/create')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Test Server' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.nested.property('server.name').to.equal('Test Server');
        done();
      });
  });

  it('should return an error if name is not provided at all', (done) => {
    chai
      .request(app)
      .post('/api/servers/create')
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should return an error if name is set to empty string', (done) => {
    chai
      .request(app)
      .post('/api/servers/create')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: '' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
  // Add more test cases for edge cases, validation, etc.
});

describe('Server Retrieval', () => {
  //Get all servers owned by user
  it('should return all servers owned by user', (done) => {
    chai
      .request(app)
      .get('/api/servers/owned')
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.nested.property('servers');
        done();
      });
  });

  //Get all servers user is a member of
  it('should return all servers user is a member of', (done) => {
    chai
      .request(app)
      .get('/api/servers/list')
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.nested.property('servers');
        expect(res.body.servers).to.have.lengthOf(1);
        done();
      });
  });
});