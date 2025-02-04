const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  userId: {
    type: String,
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
  type: {
    type: String,
    enum: ['vacation', 'sick', 'personal'],
    required: true
  },
  notes: {
    type: String,
    required: false
  },
  managerId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approverId: String,
  approverNote: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Leave', leaveSchema);