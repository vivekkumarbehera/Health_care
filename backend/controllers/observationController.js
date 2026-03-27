const Observation = require('../models/Observation');

exports.addObservation = async (req, res) => {
  const { note } = req.body;
  try {
    const observation = new Observation({
      user: req.user.id,
      note
    });
    await observation.save();
    res.status(201).json({ message: 'Observation added', observation });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getObservations = async (req, res) => {
  try {
    const observations = await Observation.find().populate('user', 'email role').sort({ timestamp: -1 });
    res.json(observations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
