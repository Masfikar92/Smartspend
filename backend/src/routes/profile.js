const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getProfile, saveProfile } = require('../controllers/profileController');

router.use(auth);
router.get('/', getProfile);
router.post('/', saveProfile);

module.exports = router;
