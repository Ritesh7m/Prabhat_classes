const mongoose = require('mongoose');

const topperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  percentage: {
    type: String,
    required: [true, 'Percentage is required']
  },
  rank: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: '/images/placeholder.png'
  },
  year: {
    type: String,
    required: true,
    default: '2026-2027'
  },
  subjects: [{
    name: String,
    score: Number
  }],
  attendanceRecord: {
    type: String,
    default: '98%'
  },
  batch: {
    type: String,
    enum: ['Hindi Medium', 'English Medium'],
    default: 'English Medium'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Topper', topperSchema);
