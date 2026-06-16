const express = require('express');
const passport = require('passport');
const { authenticate } = require('../middleware/auth');
const { googleCallback, getProfile, logout } = require('../controllers/authController');

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/login/failed' }),
  googleCallback
);

router.get('/profile', authenticate, getProfile);
router.post('/logout', authenticate, logout);

router.get('/login/failed', (req, res) => {
  res.status(401).json({ success: false, message: 'Authentication failed' });
});

module.exports = router;
