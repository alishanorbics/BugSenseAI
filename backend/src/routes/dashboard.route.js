const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { AuthVerifier } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(AuthVerifier);
router.get('/metrics', dashboardController.getDashboardMetrics);

module.exports = router;
