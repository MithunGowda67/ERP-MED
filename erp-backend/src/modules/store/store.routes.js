const express = require('express');
const { verifyToken } = require('../../shared/middlewares/auth.middleware');
const { requireRole } = require('../../shared/middlewares/role.middleware');
const { auditLog } = require('../../shared/middlewares/audit.middleware');
const { recordStockTransaction } = require('./store.controller');

const router = express.Router();

router.use(verifyToken);

router.post('/transactions', requireRole(['admin', 'staff']), auditLog('UPDATE_INVENTORY', 'stockTransactions'), recordStockTransaction);

module.exports = router;
