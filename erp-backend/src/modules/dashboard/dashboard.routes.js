const express = require('express');
const { verifyToken } = require('../../shared/middlewares/auth.middleware');
const { requireRole } = require('../../shared/middlewares/role.middleware');
const { getDashboardStats } = require('./dashboard.controller');

const router = express.Router();

router.use(verifyToken);

// Restrict heavy reads to admin and staff safely
router.get('/stats', requireRole(['admin', 'staff']), getDashboardStats);

module.exports = router;
