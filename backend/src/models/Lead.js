const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    leadId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      select: false,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    currentAssignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    disposition: {
      type: String,
      default: 'New',
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'On Hold', 'Recycled'],
      default: 'Open',
    },
    stage: {
      type: String,
      default: 'Initial',
    },
    source: String,
    customFields: mongoose.Schema.Types.Mixed,
    comments: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      text: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    assignmentHistory: [{
      assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
      },
      stage: String,
      disposition: String,
      assignedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    activityLog: [{
      action: String,
      performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      details: mongoose.Schema.Types.Mixed,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    }],
    lastTouchedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    lastTouchedAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

leadSchema.index({ department: 1, currentAssignee: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ leadId: 1 });

module.exports = mongoose.model('Lead', leadSchema);
