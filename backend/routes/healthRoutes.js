const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');
const auth = require('../middleware/auth');

router.post('/health', auth, healthController.addHealthData);
router.get('/patient/:id', auth, healthController.getHealthData);
router.get('/alerts', auth, healthController.getAlerts);

module.exports = router;
