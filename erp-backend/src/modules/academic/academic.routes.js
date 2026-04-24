const express = require('express');
const { verifyToken } = require('../../shared/middlewares/auth.middleware');
const { requireRole } = require('../../shared/middlewares/role.middleware');
const { createSession, markAttendance } = require('./academic.controller');

const router = express.Router();

router.use(verifyToken);

router.post('/sessions', requireRole(['admin', 'staff']), createSession);
router.post('/sessions/:sessionId/attendance', requireRole(['admin', 'staff']), markAttendance);

module.exports = router;
