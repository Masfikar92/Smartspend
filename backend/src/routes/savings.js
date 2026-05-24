const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { addGoal, getGoals, updateProgress, deleteGoal } = require('../controllers/savingController');

router.use(auth);

router.post('/', addGoal);
router.get('/', getGoals);
router.put('/:id/progress', updateProgress);
router.delete('/:id', deleteGoal);

module.exports = router;