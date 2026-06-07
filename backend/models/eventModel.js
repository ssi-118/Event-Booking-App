const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date and time are required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date and time are required']
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'meeting', 'holiday', 'urgent', 'general'],
    default: 'general'
  },
  location: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#3b82f6' // Default Blue
  }
}, {
  timestamps: true
});

// Validator to ensure endDate is after startDate
eventSchema.pre('validate', function(next) {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    this.invalidate('endDate', 'End date must be after start date');
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
