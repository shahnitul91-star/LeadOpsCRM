const Lead = require('../models/Lead');
const Department = require('../models/Department');

const getLeadsByUser = async (req, res) => {
  try {
    const { status, disposition } = req.query;
    let filter = { currentAssignee: req.user._id };

    if (status) filter.status = status;
    if (disposition) filter.disposition = disposition;

    const leads = await Lead.find(filter)
      .populate('currentAssignee')
      .populate('department')
      .select('-mobileNumber');

    res.status(200).json({
      success: true,
      data: leads,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching leads', error: error.message });
  }
};

const getLeadById = async (req, res) => {
  try {
    const { leadId } = req.params;
    const lead = await Lead.findById(leadId)
      .populate('currentAssignee')
      .populate('department')
      .populate('comments.userId')
      .populate('assignmentHistory.assignedTo')
      .populate('assignmentHistory.assignedBy')
      .populate('activityLog.performedBy')
      .select('-mobileNumber');

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Log view activity
    lead.activityLog.push({
      action: 'VIEWED',
      performedBy: req.user._id,
      timestamp: new Date(),
    });
    lead.lastTouchedBy = req.user._id;
    lead.lastTouchedAt = new Date();
    await lead.save();

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching lead', error: error.message });
  }
};

const updateLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { disposition, status, stage, customFields } = req.body;

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const changes = {};
    if (disposition !== undefined) {
      changes.disposition = lead.disposition;
      lead.disposition = disposition;
    }
    if (status !== undefined) {
      changes.status = lead.status;
      lead.status = status;
    }
    if (stage !== undefined) {
      changes.stage = lead.stage;
      lead.stage = stage;
    }
    if (customFields !== undefined) {
      lead.customFields = customFields;
    }

    lead.lastTouchedBy = req.user._id;
    lead.lastTouchedAt = new Date();

    lead.activityLog.push({
      action: 'UPDATED',
      performedBy: req.user._id,
      details: changes,
      timestamp: new Date(),
    });

    await lead.save();

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: lead,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating lead', error: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    lead.comments.push({
      userId: req.user._id,
      text,
      createdAt: new Date(),
    });

    lead.lastTouchedBy = req.user._id;
    lead.lastTouchedAt = new Date();

    lead.activityLog.push({
      action: 'COMMENT_ADDED',
      performedBy: req.user._id,
      details: { comment: text },
      timestamp: new Date(),
    });

    await lead.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: lead,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding comment', error: error.message });
  }
};

const getLeadHistory = async (req, res) => {
  try {
    const { leadId } = req.params;
    const lead = await Lead.findById(leadId)
      .select('assignmentHistory activityLog')
      .populate('assignmentHistory.assignedTo')
      .populate('assignmentHistory.assignedBy')
      .populate('activityLog.performedBy');

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        assignmentHistory: lead.assignmentHistory,
        activityLog: lead.activityLog,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching history', error: error.message });
  }
};

const moveLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { newDepartmentId, newStage, newDisposition } = req.body;

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const previousDepartment = lead.department;
    const previousStage = lead.stage;

    if (newDepartmentId) lead.department = newDepartmentId;
    if (newStage) lead.stage = newStage;
    if (newDisposition) lead.disposition = newDisposition;

    lead.lastTouchedBy = req.user._id;
    lead.lastTouchedAt = new Date();

    lead.activityLog.push({
      action: 'MOVED',
      performedBy: req.user._id,
      details: { previousDepartment, newDepartmentId, previousStage, newStage },
      timestamp: new Date(),
    });

    await lead.save();

    res.status(200).json({
      success: true,
      message: 'Lead moved successfully',
      data: lead,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error moving lead', error: error.message });
  }
};

module.exports = {
  getLeadsByUser,
  getLeadById,
  updateLead,
  addComment,
  getLeadHistory,
  moveLead,
};
