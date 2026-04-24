const express = require('express');
const { verifyToken } = require('../../shared/middlewares/auth.middleware');
const { requireRole } = require('../../shared/middlewares/role.middleware');
const { auditLog } = require('../../shared/middlewares/audit.middleware');
const { registerForExam, publishResults } = require('./examination.controller');

const router = express.Router();

router.use(verifyToken);

// Students register, and audits logs record precisely when a hall ticket is issued.
router.post('/register', requireRole(['student']), auditLog('REGISTER_EXAM', 'examRegistrations'), registerForExam);

// Admin/Staff publish results.
router.post('/results', requireRole(['admin', 'staff']), auditLog('PUBLISH_RESULTS', 'results'), publishResults);

module.exports = router;
