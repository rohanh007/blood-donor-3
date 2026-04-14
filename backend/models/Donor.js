const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    location: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 18, max: 65 },
    weight: { type: Number, required: true, min: 50 },
    lastDonated: { type: Date },
    availability: { type: Boolean, default: true },
    medicalHistory: { type: String, default: 'None' },
    totalDonations: { type: Number, default: 0 },
  },
  { timestamps: true }
);

donorSchema.index({ bloodGroup: 1, location: 1 });

module.exports = mongoose.model('Donor', donorSchema);
