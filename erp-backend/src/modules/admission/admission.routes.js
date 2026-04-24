const express = require('express');
const { verifyToken } = require('../../shared/middlewares/auth.middleware');
const { requireRole } = require('../../shared/middlewares/role.middleware');
const { 
  submitApplication, 
  getApplications, 
  updateApplicationStatus, 
  enrollStudent 
} = require('./admission.controller');

const router = express.Router();

router.use(verifyToken);

// General authenticated users can apply
router.post('/applications', submitApplication);

// Only admins can view, approve, and enroll
router.get('/applications', requireRole(['admin']), getApplications);
router.put('/applications/:id/status', requireRole(['admin']), updateApplicationStatus);
router.post('/applications/:id/enroll', requireRole(['admin']), enrollStudent);

module.exports = router;
