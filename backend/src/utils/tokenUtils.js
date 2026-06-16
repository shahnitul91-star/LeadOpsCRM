const JWT = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return JWT.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const verifyToken = (token) => {
  try {
    return JWT.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const checkUserPermission = (userPermissions, requiredPermissions) => {
  return requiredPermissions.some(perm => userPermissions.includes(perm));
};

const canAccessLead = async (userId, leadId) => {
  const user = await User.findById(userId).populate('role');
  if (!user) return false;

  if (user.role.name === 'Super Admin' || user.role.name === 'Admin') {
    return true;
  }

  // Add lead access logic based on role and assignment
  return false;
};

module.exports = {
  generateToken,
  verifyToken,
  checkUserPermission,
  canAccessLead,
};
