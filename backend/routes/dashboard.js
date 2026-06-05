const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate: auth } = require('../middleware/auth');

router.get('/stats', auth, dashboardController.getStats);
router.get('/activities', auth, dashboardController.getRecentActivities);

module.exports = router;