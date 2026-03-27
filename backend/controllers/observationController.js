const Observation = require('../models/Observation');
const User = require('../models/User');

exports.addObservation = async (req, res) => {
  const { note } = req.body;
  try {
    const observation = await Observation.create({
      userId: req.user.id,
      note
    });
    res.status(201).json({ message: 'Observation added', observation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getObservations = async (req, res) => {
  try {
    const observations = await Observation.findAll({
      include: [{
        model: User,
        as: 'user', // must match the alias in belongsTo definition
        attributes: ['email', 'role']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(observations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
