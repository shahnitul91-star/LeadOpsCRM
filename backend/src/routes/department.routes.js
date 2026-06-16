const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const Department = require('../models/Department');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true })
      .populate('manager')
      .populate('subdepartments');

    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching departments', error: error.message });
  }
});

router.get('/:departmentId', authenticate, async (req, res) => {
  try {
    const department = await Department.findById(req.params.departmentId)
      .populate('manager')
      .populate('subdepartments');

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching department', error: error.message });
  }
});

module.exports = router;
