const express = require('express');
const { verifyToken } = require('../../shared/middlewares/auth.middleware');
const { requireRole } = require('../../shared/middlewares/role.middleware');
const { auditLog } = require('../../shared/middlewares/audit.middleware');
const { transitionToAlumni } = require('./alumni.controller');

const router = express.Router();

router.use(verifyToken);

router.post('/transition', requireRole(['admin']), auditLog('TRANSITION_ALUMNI', 'alumni'), transitionToAlumni);

module.exports = router;
