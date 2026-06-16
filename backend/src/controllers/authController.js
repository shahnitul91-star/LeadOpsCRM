const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    if (!user.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval. Please contact administrator.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated.',
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Authentication failed', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('role')
      .populate('department')
      .populate('assignedTeams');

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profile', error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Logout failed', error: error.message });
  }
};

module.exports = {
  generateToken,
  googleCallback,
  getProfile,
  logout,
};
