const express = require('express');
const { verifyToken } = require('../../shared/middlewares/auth.middleware');
const { requireRole } = require('../../shared/middlewares/role.middleware');
const { auditLog } = require('../../shared/middlewares/audit.middleware');
const { validate } = require('../../shared/middlewares/validate.middleware');
const { movementSchema, visitorSchema } = require('./hostel.validator');

const { allocateRoom, logMovement, registerVisitor, checkoutVisitor } = require('./hostel.controller');

const router = express.Router();

router.use(verifyToken);

// Bed Allocation
router.post('/allocations', requireRole(['admin']), auditLog('ALLOCATE_BED', 'hostelAllocations'), allocateRoom);

// Movement Mechanics
router.post('/:hostelId/movement', requireRole(['student', 'staff', 'admin']), validate(movementSchema), auditLog('LOG_MOVEMENT', 'movementRegister'), logMovement);

// Security / Visitor Operations
router.post('/:hostelId/visitors', requireRole(['staff', 'admin']), validate(visitorSchema), auditLog('REGISTER_VISITOR', 'visitors'), registerVisitor);
router.put('/:hostelId/visitors/:visitorId/checkout', requireRole(['staff', 'admin']), auditLog('CHECKOUT_VISITOR', 'visitors'), checkoutVisitor);

module.exports = router;
