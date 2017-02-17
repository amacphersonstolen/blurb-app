'use strict';

/**
 * Module dependencies
 */
var blurbsPolicy = require('../policies/blurbs.server.policy'),
  blurbs = require('../controllers/blurbs.server.controller');

module.exports = function(app) {
  // Blurbs Routes
  app.route('/api/blurbs').all(blurbsPolicy.isAllowed)
    .get(blurbs.list)
    .post(blurbs.create);

  app.route('/api/blurbs/:blurbId').all(blurbsPolicy.isAllowed)
    .get(blurbs.read)
    .put(blurbs.update)
    .delete(blurbs.delete);

  // Finish by binding the Blurb middleware
  app.param('blurbId', blurbs.blurbByID);
};
