const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    description: String,
    parentDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    subdepartments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    }],
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    dispositions: [{
      name: String,
      description: String,
      color: String,
      isActive: Boolean,
    }],
    googleSheetId: String,
    googleSheetRange: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Department', departmentSchema);
