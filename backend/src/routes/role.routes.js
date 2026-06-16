const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const Role = require('../models/Role');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const roles = await Role.find({ isActive: true });

    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching roles', error: error.message });
  }
});

router.get('/:roleId', authenticate, async (req, res) => {
  try {
    const role = await Role.findById(req.params.roleId);

    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching role', error: error.message });
  }
});

module.exports = router;
