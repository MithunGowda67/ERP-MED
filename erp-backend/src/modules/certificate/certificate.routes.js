const express = require('express');
const { verifyToken } = require('../../shared/middlewares/auth.middleware');
const { requireRole } = require('../../shared/middlewares/role.middleware');
const { auditLog } = require('../../shared/middlewares/audit.middleware');
const { issueCertificate } = require('./certificate.controller');

const router = express.Router();

router.use(verifyToken);

router.post('/issue', requireRole(['admin']), auditLog('ISSUE_CERTIFICATE', 'certificates'), issueCertificate);

module.exports = router;
