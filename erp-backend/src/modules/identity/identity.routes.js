const express = require('express');
const { getProfile, setupProfile } = require('./identity.controller');
const { verifyToken } = require('../../shared/middlewares/auth.middleware');

const router = express.Router();

router.use(verifyToken);

router.get('/profile', getProfile);
router.post('/setup', setupProfile);

module.exports = router;
