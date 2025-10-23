// models/Sprint.js

const mongoose = require('mongoose');

const sprintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  sprintNumber: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['planned', 'active', 'completed'],
    default: 'planned'
  },
  goals: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Sprint', sprintSchema);

