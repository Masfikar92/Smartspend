const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect ke frontend dengan token
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${token}&name=${encodeURIComponent(user.full_name)}&email=${user.email}&avatar=${user.avatar || ''}&google_id=${user.google_id || ''}`);
  }
);

module.exports = router;