const HealthData = require('../models/HealthData');
const Alert = require('../models/Alert');

exports.addHealthData = async (req, res) => {
  if (req.user.role !== 'Care Manager') {
    return res.status(403).json({ message: 'Access denied: Care Managers only' });
  }

  const { heartRate, oxygenLevel, bloodPressure } = req.body;
  try {
    const data = new HealthData({
      patient: req.user.id,
      heartRate,
      oxygenLevel,
      bloodPressure
    });
    await data.save();

    // Automated Alert Generation Logic
    let alertMsg = '';
    let severity = 'Normal';

    if (heartRate > 100 || heartRate < 60) {
      alertMsg = `Abnormal Heart Rate detected: ${heartRate} BPM`;
      severity = heartRate > 120 ? 'Critical' : 'Warning';
    } else if (oxygenLevel < 95) {
      alertMsg = `Low Oxygen Level: ${oxygenLevel}%`;
      severity = oxygenLevel < 90 ? 'Critical' : 'Warning';
    }

    if (alertMsg) {
      const alert = new Alert({
        user: req.user.id,
        message: alertMsg,
        severity
      });
      await alert.save();
    }

    res.status(201).json({ message: 'Health data saved', data });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getHealthData = async (req, res) => {
  try {
    const data = await HealthData.findOne({ patient: req.user.id }).sort({ timestamp: -1 });
    res.json(data || {});
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user.id }).sort({ timestamp: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
