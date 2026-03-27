const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');
const auth = require('../middleware/auth');

router.post('/health', auth, healthController.addHealthData);
router.get('/patient/current', auth, healthController.getCurrentHealthData);
router.get('/patient/:id', auth, healthController.getHealthData);
router.get('/alerts', auth, healthController.getAlerts);
router.post('/health/seed', auth, healthController.seedDefaultHealthData);
router.post('/health/random', auth, healthController.generateRandomHealthData);

module.exports = router;
