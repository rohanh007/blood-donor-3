const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    location: { type: String, required: true, trim: true },
    unitsRequired: { type: Number, required: true, min: 1, max: 10 },
    urgency: { type: String, enum: ['normal', 'urgent', 'critical'], default: 'normal' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'completed', 'rejected'],
      default: 'pending',
    },
    notes: { type: String },
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);
