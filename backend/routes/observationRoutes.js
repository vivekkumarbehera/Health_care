const express = require('express');
const router = express.Router();
const observationController = require('../controllers/observationController');
const auth = require('../middleware/auth');

router.post('/', auth, observationController.addObservation);
router.get('/', auth, observationController.getObservations);

module.exports = router;
