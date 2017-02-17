'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Blurb = mongoose.model('Blurb'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Blurb
 */
exports.create = function(req, res) {
  var blurb = new Blurb(req.body);
  blurb.user = req.user;

  blurb.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(blurb);
    }
  });
};

/**
 * Show the current Blurb
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var blurb = req.blurb ? req.blurb.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  blurb.isCurrentUserOwner = req.user && blurb.user && blurb.user._id.toString() === req.user._id.toString();

  res.jsonp(blurb);
};

/**
 * Update a Blurb
 */
exports.update = function(req, res) {
  var blurb = req.blurb;

  blurb = _.extend(blurb, req.body);

  blurb.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(blurb);
    }
  });
};

/**
 * Delete an Blurb
 */
exports.delete = function(req, res) {
  var blurb = req.blurb;

  blurb.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(blurb);
    }
  });
};

/**
 * List of Blurbs
 */
exports.list = function(req, res) {
  Blurb.find().sort('-created').populate('user', 'displayName').exec(function(err, blurbs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(blurbs);
    }
  });
};

/**
 * Blurb middleware
 */
exports.blurbByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Blurb is invalid'
    });
  }

  Blurb.findById(id).populate('user', 'displayName').exec(function (err, blurb) {
    if (err) {
      return next(err);
    } else if (!blurb) {
      return res.status(404).send({
        message: 'No Blurb with that identifier has been found'
      });
    }
    req.blurb = blurb;
    next();
  });
};
