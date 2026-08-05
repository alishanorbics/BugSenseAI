const express = require('express');
const authRoutes = require('./auth.route');
const projectRoutes = require('./project.route');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);

module.exports = router;
