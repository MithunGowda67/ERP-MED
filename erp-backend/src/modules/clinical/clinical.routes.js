const express = require('express');
const { verifyToken } = require('../../shared/middlewares/auth.middleware');
const { requireRole } = require('../../shared/middlewares/role.middleware');
const { auditLog } = require('../../shared/middlewares/audit.middleware');
const { submitClinicalLog, verifyClinicalLog } = require('./clinical.controller');

const router = express.Router();

router.use(verifyToken);

router.post('/logs', requireRole(['student']), submitClinicalLog);
router.put('/logs/:logId/verify', requireRole(['admin', 'staff']), auditLog('VERIFY_LOG', 'clinicalLog'), verifyClinicalLog);

module.exports = router;
