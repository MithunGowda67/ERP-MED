const express = require('express');
const { verifyToken } = require('../../shared/middlewares/auth.middleware');
const { requireRole } = require('../../shared/middlewares/role.middleware');
const { createFeeStructure, generateDemands, createTransaction } = require('./fees.controller');

const router = express.Router();

router.use(verifyToken);

router.post('/structures', requireRole(['admin']), createFeeStructure);
router.post('/demands/generate', requireRole(['admin']), generateDemands);
router.post('/transactions', requireRole(['admin', 'student']), createTransaction);

module.exports = router;
