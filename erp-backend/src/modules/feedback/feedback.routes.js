const express = require('express');
const { verifyToken } = require('../../shared/middlewares/auth.middleware');
const { requireRole } = require('../../shared/middlewares/role.middleware');
const { submitFeedback } = require('./feedback.controller');

const router = express.Router();

router.use(verifyToken);

// Students and staff can leave feedback
router.post('/submit', requireRole(['student', 'staff']), submitFeedback);

module.exports = router;
