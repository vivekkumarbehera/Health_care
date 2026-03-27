const HealthData = require('../models/HealthData');
const Alert = require('../models/Alert');

exports.addHealthData = async (req, res) => {
  if (req.user.role !== 'Care Manager') {
    return res.status(403).json({ message: 'Access denied: Care Managers only' });
  }

  const { heartRate, oxygenLevel, bloodPressure } = req.body;
  try {
    const data = await HealthData.create({
      patientId: req.user.id,
      heartRate,
      oxygenLevel,
      bloodPressure
    });

    // --- Rule-Based Alert Engine ---
    const alertsToCreate = [];

    // Rule 1: Heart Rate — below 50 or above 110
    if (heartRate < 50 || heartRate > 110) {
      alertsToCreate.push({
        userId: req.user.id,
        message: `Abnormal Heart Rate detected: ${heartRate} BPM (normal range: 50–110)`,
        severity: 'Alert'
      });
    }

    // Rule 2: Oxygen Level — below 92 is Critical
    if (oxygenLevel < 92) {
      alertsToCreate.push({
        userId: req.user.id,
        message: `Critical Oxygen Level: ${oxygenLevel}% (below safe threshold of 92%)`,
        severity: 'Critical'
      });
    }

    // Rule 3: Blood Pressure — systolic > 140 or diastolic > 90
    if (bloodPressure) {
      const parts = bloodPressure.toString().split('/');
      const systolic = parseInt(parts[0], 10);
      const diastolic = parseInt(parts[1], 10);
      if (!isNaN(systolic) && !isNaN(diastolic) && (systolic > 140 || diastolic > 90)) {
        alertsToCreate.push({
          userId: req.user.id,
          message: `High Blood Pressure detected: ${bloodPressure} mmHg (threshold: 140/90)`,
          severity: 'Warning'
        });
      }
    }

    // Persist all generated alerts
    if (alertsToCreate.length > 0) {
      await Alert.bulkCreate(alertsToCreate);
    }

    res.status(201).json({ message: 'Health data saved', data, alertsGenerated: alertsToCreate.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getHealthData = async (req, res) => {
  try {
    const data = await HealthData.findOne({
      where: { patientId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(data || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Returns the most recent health record for the authenticated user
exports.getCurrentHealthData = async (req, res) => {
  try {
    const data = await HealthData.findOne({
      where: { patientId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(data || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Smart Randomized Seed --- generates realistic vitals per user (only once)
exports.seedDefaultHealthData = async (req, res) => {
  try {
    const existing = await HealthData.findOne({ where: { patientId: req.user.id } });
    if (existing) {
      return res.json({ message: 'Data already exists', seeded: false });
    }

    // Random helpers
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // Generate randomized vitals — realistic ranges that may or may not cross alert thresholds
    const heartRate   = randInt(42, 130);       // normal: 50–110
    const oxygenLevel = randInt(85, 99);        // critical if < 92
    const systolic    = randInt(100, 170);      // warning if > 140
    const diastolic   = randInt(60, 100);       // warning if > 90
    const bloodPressure = `${systolic}/${diastolic}`;

    const data = await HealthData.create({
      patientId: req.user.id,
      heartRate,
      oxygenLevel,
      bloodPressure
    });

    // Run the same rule engine used in addHealthData
    const alertsToCreate = [];

    if (heartRate < 50 || heartRate > 110) {
      alertsToCreate.push({
        userId: req.user.id,
        message: `Abnormal Heart Rate detected: ${heartRate} BPM (normal range: 50–110)`,
        severity: 'Alert'
      });
    }

    if (oxygenLevel < 92) {
      alertsToCreate.push({
        userId: req.user.id,
        message: `Critical Oxygen Level: ${oxygenLevel}% (below safe threshold of 92%)`,
        severity: 'Critical'
      });
    }

    if (systolic > 140 || diastolic > 90) {
      alertsToCreate.push({
        userId: req.user.id,
        message: `High Blood Pressure detected: ${bloodPressure} mmHg (threshold: 140/90)`,
        severity: 'Warning'
      });
    }

    if (alertsToCreate.length > 0) {
      await Alert.bulkCreate(alertsToCreate);
    }

    res.status(201).json({
      message: 'Randomized health data seeded successfully',
      data,
      alertsGenerated: alertsToCreate.length,
      seeded: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Manual Random Vital Generator --- allows users to 'simulate' a new health event
exports.generateRandomHealthData = async (req, res) => {
  try {
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const heartRate   = randInt(42, 130);
    const oxygenLevel = randInt(85, 99);
    const systolic    = randInt(100, 170);
    const diastolic   = randInt(60, 100);
    const bloodPressure = `${systolic}/${diastolic}`;

    const data = await HealthData.create({
      patientId: req.user.id,
      heartRate,
      oxygenLevel,
      bloodPressure
    });

    const alertsToCreate = [];
    if (heartRate < 50 || heartRate > 110) {
      alertsToCreate.push({
        userId: req.user.id,
        message: `Abnormal Heart Rate detected: ${heartRate} BPM (normal range: 50–110)`,
        severity: 'Alert'
      });
    }
    if (oxygenLevel < 92) {
      alertsToCreate.push({
        userId: req.user.id,
        message: `Critical Oxygen Level: ${oxygenLevel}% (below safe threshold of 92%)`,
        severity: 'Critical'
      });
    }
    if (systolic > 140 || diastolic > 90) {
      alertsToCreate.push({
        userId: req.user.id,
        message: `High Blood Pressure detected: ${bloodPressure} mmHg (threshold: 140/90)`,
        severity: 'Warning'
      });
    }

    if (alertsToCreate.length > 0) {
      await Alert.bulkCreate(alertsToCreate);
    }

    res.status(201).json({
      message: 'New simulated vitals generated',
      data,
      alertsGenerated: alertsToCreate.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

