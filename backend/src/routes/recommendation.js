const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getRecommendation } = require('../controllers/recommendationController');

router.use(auth);
router.get('/', getRecommendation);

module.exports = router;