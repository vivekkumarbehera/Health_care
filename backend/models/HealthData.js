const mongoose = require('mongoose');

const HealthDataSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  heartRate: { type: Number, required: true },
  oxygenLevel: { type: Number, required: true },
  bloodPressure: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HealthData', HealthDataSchema);
