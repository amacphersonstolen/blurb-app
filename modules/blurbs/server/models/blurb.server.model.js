'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Blurb Schema
 */
var BlurbSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Blurb name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill Blurb description',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Blurb', BlurbSchema);
