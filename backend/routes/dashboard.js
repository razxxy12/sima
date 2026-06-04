const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');
router.get('/stats', authenticate, dashboardController.getStats);
router.get('/activities', authenticate, dashboardController.getRecentActivities);
module.exports = router;