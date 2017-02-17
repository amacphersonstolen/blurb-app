'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Blurb = mongoose.model('Blurb'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  blurb;

/**
 * Blurb routes tests
 */
describe('Blurb CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Blurb
    user.save(function () {
      blurb = {
        name: 'Blurb name'
      };

      done();
    });
  });

  it('should be able to save a Blurb if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Blurb
        agent.post('/api/blurbs')
          .send(blurb)
          .expect(200)
          .end(function (blurbSaveErr, blurbSaveRes) {
            // Handle Blurb save error
            if (blurbSaveErr) {
              return done(blurbSaveErr);
            }

            // Get a list of Blurbs
            agent.get('/api/blurbs')
              .end(function (blurbsGetErr, blurbsGetRes) {
                // Handle Blurbs save error
                if (blurbsGetErr) {
                  return done(blurbsGetErr);
                }

                // Get Blurbs list
                var blurbs = blurbsGetRes.body;

                // Set assertions
                (blurbs[0].user._id).should.equal(userId);
                (blurbs[0].name).should.match('Blurb name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Blurb if not logged in', function (done) {
    agent.post('/api/blurbs')
      .send(blurb)
      .expect(403)
      .end(function (blurbSaveErr, blurbSaveRes) {
        // Call the assertion callback
        done(blurbSaveErr);
      });
  });

  it('should not be able to save an Blurb if no name is provided', function (done) {
    // Invalidate name field
    blurb.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Blurb
        agent.post('/api/blurbs')
          .send(blurb)
          .expect(400)
          .end(function (blurbSaveErr, blurbSaveRes) {
            // Set message assertion
            (blurbSaveRes.body.message).should.match('Please fill Blurb name');

            // Handle Blurb save error
            done(blurbSaveErr);
          });
      });
  });

  it('should be able to update an Blurb if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Blurb
        agent.post('/api/blurbs')
          .send(blurb)
          .expect(200)
          .end(function (blurbSaveErr, blurbSaveRes) {
            // Handle Blurb save error
            if (blurbSaveErr) {
              return done(blurbSaveErr);
            }

            // Update Blurb name
            blurb.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Blurb
            agent.put('/api/blurbs/' + blurbSaveRes.body._id)
              .send(blurb)
              .expect(200)
              .end(function (blurbUpdateErr, blurbUpdateRes) {
                // Handle Blurb update error
                if (blurbUpdateErr) {
                  return done(blurbUpdateErr);
                }

                // Set assertions
                (blurbUpdateRes.body._id).should.equal(blurbSaveRes.body._id);
                (blurbUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Blurbs if not signed in', function (done) {
    // Create new Blurb model instance
    var blurbObj = new Blurb(blurb);

    // Save the blurb
    blurbObj.save(function () {
      // Request Blurbs
      request(app).get('/api/blurbs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Blurb if not signed in', function (done) {
    // Create new Blurb model instance
    var blurbObj = new Blurb(blurb);

    // Save the Blurb
    blurbObj.save(function () {
      request(app).get('/api/blurbs/' + blurbObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', blurb.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Blurb with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/blurbs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Blurb is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Blurb which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Blurb
    request(app).get('/api/blurbs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Blurb with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Blurb if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Blurb
        agent.post('/api/blurbs')
          .send(blurb)
          .expect(200)
          .end(function (blurbSaveErr, blurbSaveRes) {
            // Handle Blurb save error
            if (blurbSaveErr) {
              return done(blurbSaveErr);
            }

            // Delete an existing Blurb
            agent.delete('/api/blurbs/' + blurbSaveRes.body._id)
              .send(blurb)
              .expect(200)
              .end(function (blurbDeleteErr, blurbDeleteRes) {
                // Handle blurb error error
                if (blurbDeleteErr) {
                  return done(blurbDeleteErr);
                }

                // Set assertions
                (blurbDeleteRes.body._id).should.equal(blurbSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Blurb if not signed in', function (done) {
    // Set Blurb user
    blurb.user = user;

    // Create new Blurb model instance
    var blurbObj = new Blurb(blurb);

    // Save the Blurb
    blurbObj.save(function () {
      // Try deleting Blurb
      request(app).delete('/api/blurbs/' + blurbObj._id)
        .expect(403)
        .end(function (blurbDeleteErr, blurbDeleteRes) {
          // Set message assertion
          (blurbDeleteRes.body.message).should.match('User is not authorized');

          // Handle Blurb error error
          done(blurbDeleteErr);
        });

    });
  });

  it('should be able to get a single Blurb that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Blurb
          agent.post('/api/blurbs')
            .send(blurb)
            .expect(200)
            .end(function (blurbSaveErr, blurbSaveRes) {
              // Handle Blurb save error
              if (blurbSaveErr) {
                return done(blurbSaveErr);
              }

              // Set assertions on new Blurb
              (blurbSaveRes.body.name).should.equal(blurb.name);
              should.exist(blurbSaveRes.body.user);
              should.equal(blurbSaveRes.body.user._id, orphanId);

              // force the Blurb to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Blurb
                    agent.get('/api/blurbs/' + blurbSaveRes.body._id)
                      .expect(200)
                      .end(function (blurbInfoErr, blurbInfoRes) {
                        // Handle Blurb error
                        if (blurbInfoErr) {
                          return done(blurbInfoErr);
                        }

                        // Set assertions
                        (blurbInfoRes.body._id).should.equal(blurbSaveRes.body._id);
                        (blurbInfoRes.body.name).should.equal(blurb.name);
                        should.equal(blurbInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Blurb.remove().exec(done);
    });
  });
});
