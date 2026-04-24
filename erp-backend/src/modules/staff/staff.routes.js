const express = require('express');
const { verifyToken } = require('../../shared/middlewares/auth.middleware');
const { requireRole } = require('../../shared/middlewares/role.middleware');
const { auditLog } = require('../../shared/middlewares/audit.middleware');
const { submitLeaveRequest, getPendingLeaves, generatePayroll } = require('./staff.controller');

const router = express.Router();

router.use(verifyToken);

// Leave flows
router.post('/leaves', requireRole(['staff']), submitLeaveRequest);
router.get('/leaves/pending', requireRole(['admin']), getPendingLeaves);

// Payroll flow - Highly sensitive, explicitly audited
router.post('/payroll/generate', requireRole(['admin']), auditLog('GENERATE_PAYROLL', 'payroll'), generatePayroll);

module.exports = router;
