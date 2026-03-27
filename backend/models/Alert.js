const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
  severity: { type: String, enum: ['Critical', 'Warning', 'Normal'], default: 'Normal' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', AlertSchema);
