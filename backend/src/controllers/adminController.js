const User = require('../models/User');
const Role = require('../models/Role');
const Department = require('../models/Department');
const Lead = require('../models/Lead');

const createUser = async (req, res) => {
  try {
    const { email, firstName, lastName, roleId, departmentId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = new User({
      email,
      firstName,
      lastName,
      role: roleId,
      department: departmentId,
      isActive: true,
      isApproved: true,
      approvedBy: req.user._id,
      approvalDate: new Date(),
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating user', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, roleId, departmentId, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, role: roleId, department: departmentId, isActive },
      { new: true }
    ).populate('role department');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user', error: error.message });
  }
};

const assignRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    user.role = roleId;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Role assigned successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error assigning role', error: error.message });
  }
};

const assignLead = async (req, res) => {
  try {
    const { leadId, userId, departmentId } = req.body;

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const previousAssignee = lead.currentAssignee;

    lead.currentAssignee = userId;
    lead.department = departmentId;
    lead.assignmentHistory.push({
      assignedTo: userId,
      assignedBy: req.user._id,
      department: departmentId,
      assignedAt: new Date(),
    });

    lead.activityLog.push({
      action: 'ASSIGNED',
      performedBy: req.user._id,
      details: { previousAssignee, newAssignee: userId },
      timestamp: new Date(),
    });

    await lead.save();

    res.status(200).json({
      success: true,
      message: 'Lead assigned successfully',
      data: lead,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error assigning lead', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { roleId, departmentId, isActive } = req.query;

    let filter = {};
    if (roleId) filter.role = roleId;
    if (departmentId) filter.department = departmentId;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const users = await User.find(filter)
      .populate('role')
      .populate('department')
      .select('-password -mobileNumber');

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
  }
};

const getDepartmentStats = async (req, res) => {
  try {
    const stats = await Lead.aggregate([
      {
        $group: {
          _id: '$department',
          totalLeads: { $sum: 1 },
          openLeads: { $sum: { $cond: [{ $eq: ['$status', 'Open'] }, 1, 0] } },
          closedLeads: { $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] } },
        },
      },
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: '_id',
          as: 'departmentInfo',
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching stats', error: error.message });
  }
};

module.exports = {
  createUser,
  updateUser,
  assignRole,
  assignLead,
  getAllUsers,
  getDepartmentStats,
};
